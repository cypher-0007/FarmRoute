

export function initialize() {

        function switchTab(tab) {
            const loginForm = document.getElementById('form-container-login');
            const signupForm = document.getElementById('form-container-signup');
            const loginTab = document.getElementById('tab-login');
            const signupTab = document.getElementById('tab-signup');

            if (tab === 'login') {
                signupForm.classList.add('hidden', 'opacity-0', 'scale-95');
                loginForm.classList.remove('hidden');
                setTimeout(() => {
                    loginForm.classList.remove('opacity-0', 'scale-95');
                    loginForm.classList.add('opacity-100', 'scale-100');
                }, 50);

                loginTab.className = "w-1/2 text-center pb-4 text-base font-semibold border-b-4 border-emerald-700 text-emerald-800 transition-all duration-200";
                signupTab.className = "w-1/2 text-center pb-4 text-base font-medium text-gray-400 hover:text-gray-600 border-b-4 border-transparent transition-all duration-200";
            } else if (tab === 'signup') {
                loginForm.classList.add('hidden', 'opacity-0', 'scale-95');
                signupForm.classList.remove('hidden');
                setTimeout(() => {
                    signupForm.classList.remove('opacity-0', 'scale-95');
                    signupForm.classList.add('opacity-100', 'scale-100');
                }, 50);

                signupTab.className = "w-1/2 text-center pb-4 text-base font-semibold border-b-4 border-emerald-700 text-emerald-800 transition-all duration-200";
                loginTab.className = "w-1/2 text-center pb-4 text-base font-medium text-gray-400 hover:text-gray-600 border-b-4 border-transparent transition-all duration-200";
            }
        }

        function selectRole(role) {
            document.getElementById('user-role').value = role;
            const farmerBtn = document.getElementById('role-farmer');
            const driverBtn = document.getElementById('role-driver');

            if (role === 'farmer') {
                farmerBtn.classList.add('border-emerald-700', 'bg-emerald-50', 'text-emerald-800', 'font-semibold');
                farmerBtn.classList.remove('border-gray-200', 'bg-white', 'text-gray-500', 'font-medium');
                
                driverBtn.classList.add('border-gray-200', 'bg-white', 'text-gray-500', 'font-medium');
                driverBtn.classList.remove('border-emerald-700', 'bg-emerald-50', 'text-emerald-800', 'font-semibold');
            } else {
                driverBtn.classList.add('border-emerald-700', 'bg-emerald-50', 'text-emerald-800', 'font-semibold');
                driverBtn.classList.remove('border-gray-200', 'bg-white', 'text-gray-500', 'font-medium');
                
                farmerBtn.classList.add('border-gray-200', 'bg-white', 'text-gray-500', 'font-medium');
                farmerBtn.classList.remove('border-emerald-700', 'bg-emerald-50', 'text-emerald-800', 'font-semibold');
            }
        }

        const togglePassword = document.getElementById('toggle-signup-password');
        const signupPasswordInput = document.getElementById('signup-password');
        
        if (togglePassword && signupPasswordInput) {
            togglePassword.addEventListener('click', function() {
                const type = signupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                signupPasswordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    
  return {switchTab: switchTab, selectRole: selectRole};
}
