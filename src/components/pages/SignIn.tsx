import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;




