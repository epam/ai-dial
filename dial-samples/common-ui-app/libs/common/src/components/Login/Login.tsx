import { FC } from 'react';
import Button from '@/custom-app-ui/common/src/components/Button/Button';

interface Props {
  onClick: () => void;
  shouldLogin: boolean;
}

const Login: FC<Props> = ({ onClick, shouldLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Button disable={shouldLogin} onClick={onClick} title="Login" />
    </div>
  );
};

export default Login;
