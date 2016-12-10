(function () {
    angular.module('Maximaximum-ngPasswordStrength', []);
})();
(function () {
    // This algorithm depends on https://github.com/lowe/zxcvbn (MIT) and loads 700kb of dictionaries but is more accurate
    angular.module('Maximaximum-ngPasswordStrength').factory('passwordStrength', function () {
        "ngInject";

        (function () {
            var a = function a() {
                var a, b;
                b = document.createElement("script");
                b.src = "//cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.1/zxcvbn.js";
                b.type = "text/javascript";
                b.async = !0;
                a = document.getElementsByTagName("script")[0];
                return a.parentNode.insertBefore(b, a);
            };
            a();
        }).call(this);

        return {

            calculate: function calculate(password) {

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
(function () {
    angular.module('Maximaximum-ngPasswordStrength').directive('ngPasswordStrength', ["$compile", "passwordStrength", function ($compile, passwordStrength) {
        "ngInject";

        return {

            scope: {
                model: '=ngModel'
            },

            replace: false,

            // This linker function adds the template after the element
            // and is needed because angular doesn't support something like this
            // out of the box. Working with ng-transclude would
            // add a additional scope and prevent updating the model in the parent scope
            link: function link($scope, $element) {

                // The template to append
                var template = '<div class="ng-password-strength-bar" ng-show="strength !== undefined"><div class="ng-password-strength-bar-inner {{ getColor(strength) }}" style="width: {{ strength }}%;"></div></div>',
                    $newElement;

                // Create a element out of the template, and add it after the directive element
                $newElement = angular.element(template);

                // Add it after the directive element
                $element.after($newElement);

                // Compile it
                $compile($newElement)($scope);
            },

            controller: ["$scope", function controller($scope) {

                $scope.strength = undefined;

                $scope.$watch("model", function (password) {

                    $scope.strength = displayMinimumStrength(passwordStrength.calculate(password));
                });

                $scope.getColor = function (strength) {

                    if (strength > 66) {
                        return 'green';
                    }

                    if (strength > 33) {
                        return 'orange';
                    }

                    return 'red';
                };

                function displayMinimumStrength(strength) {

                    // Display at least 10, so the user sees a red bar
                    if (strength < 10) {
                        strength = 10;
                    }

                    return strength;
                }
            }],
            require: 'ngModel'

        };
    }]);
})();