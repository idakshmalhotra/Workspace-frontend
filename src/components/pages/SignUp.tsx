import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;




