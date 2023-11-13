import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const generateAccessToken = (user_id: number): string => {
  const payload = {
    id: user_id,
    type: 'access_token',
  };
  const options = {
    expiresIn: '1d',
  };

  return sign(payload, process.env.JWT_SECRET, options);
};

const generateRefreshToken = (
  user_id: number,
): {
  id: string;
  token: string;
} => {
  const payload = {
    id: uuidv4(),
    user_id,
    type: 'refresh_token',
  };
  const options = {
    expiresIn: '30d',
  };

  return {
    id: payload.id,
    token: sign(payload, process.env.JWT_SECRET, options),
  };
};

const updateTokens = async (
  user_id: number,
): Promise<{ id: string; access_token: string; refresh_token: string }> => {
  const access_token = generateAccessToken(user_id);
  const refresh_token = generateRefreshToken(user_id);

  return {
    id: refresh_token.id,
    access_token,
    refresh_token: refresh_token.token,
  };
};

export { generateAccessToken, generateRefreshToken, updateTokens };
