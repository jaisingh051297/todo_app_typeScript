import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export type User = {
  username: string;
  password: string;
  profile: {
    name: string;
    email: string;
  };
  todos: Todo[];
};

export type Todo = {
  id: number;
  title: string;
  subTasks?: Todo[];
};

type State = {
  user: User | null;
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODOS'; payload: Todo[] };

type Dispatch = (action: Action) => void;

const initialState: State = {
  user: null,
};

const AuthContext = createContext<{ state: State; dispatch: Dispatch }>({
  state: initialState,
  dispatch: () => {},
});

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TODO':
      if (state.user) {
        const updatedUser: User = {
          ...state.user,
          todos: [...state.user.todos, action.payload],
        };
        return { ...state, user: updatedUser };
      }
      return state;
    case 'UPDATE_TODOS':
      if (state.user) {
        const updatedUser: User = {
          ...state.user,
          todos: action.payload,
        };
        return { ...state, user: updatedUser };
      }
      return state;
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Simulating fetching user data from localStorage or API
    const fetchUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN', payload: parsedUser });
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Simulating storing user data in localStorage
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
