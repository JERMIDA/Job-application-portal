import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;