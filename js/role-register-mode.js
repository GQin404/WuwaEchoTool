/* 仅在显式预览入口启用，视口模式在载入时确定，避免重复初始化旧事件。 */
(function () {
    'use strict';
    window.RoleRegisterMode = new URLSearchParams(location.search).get('view') === 'register' && matchMedia('(min-width: 1100px)').matches;
    if (window.RoleRegisterMode) document.documentElement.classList.add('role-register-page');
})();
