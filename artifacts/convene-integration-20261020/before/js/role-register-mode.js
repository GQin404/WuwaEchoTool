/* 共用入口规则；视口模式在载入时确定，避免重复初始化旧事件。 */
(function () {
    'use strict';
    window.RoleRegisterMode = window.UiView ? window.UiView.state.effective==='register' : new URLSearchParams(location.search).get('view') === 'register';
    if (window.RoleRegisterMode) document.documentElement.classList.add('role-register-page');
})();
