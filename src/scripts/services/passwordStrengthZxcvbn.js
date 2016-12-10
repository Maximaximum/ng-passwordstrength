(() => {
    // This algorithm depends on https://github.com/lowe/zxcvbn (MIT) and loads 700kb of dictionaries but is more accurate
    angular.module('Maximaximum-ngPasswordStrength').factory('passwordStrength', function () {
        "ngInject";
        (function () {
            var a = function () {
                var a, b;
                b = document.createElement("script");
                b.src = "//cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.1/zxcvbn.js";
                b.type = "text/javascript";
                b.async = !0;
                a = document.getElementsByTagName("script")[0];
                return a.parentNode.insertBefore(b, a)
            };
            a();
        }).call(this);

        return {

            calculate: function (password) {

                var strength;

                if (password === undefined) {
                    return undefined;
                }

                password = password.replace(/\s+/g, "");

                if (password == '') {
                    return undefined;
                }

                strength = zxcvbn(password);
                strength = (strength.score + 1) * 20;

                return strength;

            }

        };

    });
})();