import * as bcrypt from 'bcrypt';

// export const hashPassword = (password: string): string => {
//   const salt = bcrypt.genSaltSync(10);
//   return bcrypt.hashSync(password, salt);
// };
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// export const comparePasswords = (password: string, hashedPassword: string): boolean => {
//   return bcrypt.compareSync(password, hashedPassword);
// };
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}; 