import data from '../data/users.json';

export const getUserByUsername = (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = data.users.find((user: any) => user.username === username);
      resolve(user || null);
    }, 500);
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
