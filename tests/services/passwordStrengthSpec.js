describe("Unit-Tests: passwordStrength service", function () {

    // Mock application    
    beforeEach(angular.mock.module('Maximaximum-ngPasswordStrength'));

    // Inject service to test
    beforeEach(inject(function ($injector) {
        passwordStrengthService = $injector.get('passwordStrength');
    }));

    it('should have a passwordStrength service', function () {

        expect(passwordStrengthService).not.toEqual(null);

    });

    describe("Additions", function () {

        it('should give points for characters', function () {

            var strength = passwordStrengthService.characters("12345");
            expect(strength).toEqual(5 * 4);

        });

        it('should give points for uppercase characters', function () {

            // Note: the first uppercase character doesn't count
            var strength = passwordStrengthService.uppercaseCharacters("AaAaaAa");
            expect(strength).toEqual((6 - (3 - 1)) * 2);

        });

        it('should give points for lowercase characters', function () {

            var strength = passwordStrengthService.lowercaseCharacters("aaAaAAaAa");
            expect(strength).toEqual((9 - 5) * 2);

        });

        it('should give points for numbers', function () {

            var strength = passwordStrengthService.numbers("0aa1Aa2AAa3Aa456789");
            expect(strength).toEqual(10 * 4);

        });

        it('should give points for symbols', function () {

            var strength = passwordStrengthService.symbols("a%$4%&§");
            expect(strength).toEqual(5 * 6);

        });

        it('should give points for middle numbers or symbols', function () {

            var strength = passwordStrengthService.middleNumbersOrSymbols("$a%$%&§");
            expect(strength).toEqual(4 * 2);

            var strength = passwordStrengthService.middleNumbersOrSymbols("12345");
            expect(strength).toEqual(3 * 2);

        });

        it('should give points for requirements', function () {

            // 2 matched -> need 4 to count
            var strength = passwordStrengthService.requirements("abcdefgh");
            expect(strength).toEqual(0);

            var strength = passwordStrengthService.requirements("abcdef&h");
            expect(strength).toEqual(0);

            var strength = passwordStrengthService.requirements("aBcdef&h");
            expect(strength).toEqual(4 * 2);

            var strength = passwordStrengthService.requirements("aBcd4f&h");
            expect(strength).toEqual(5 * 2);

        });

    });

    describe("Deductions", function () {

        it('should deduct points for passwords with only letters', function () {

            var strength = passwordStrengthService.lettersOnly("aaaaaaaaaa");
            expect(strength).toEqual(-10);

            var strength = passwordStrengthService.lettersOnly("aaaaaaaaaa1");
            expect(strength).toEqual(0);

        });

        it('should deduct points for passwords with numbers only', function () {

            var strength = passwordStrengthService.numbersOnly("1234567890");
            expect(strength).toEqual(-10);

            var strength = passwordStrengthService.numbersOnly("1234567890a");
            expect(strength).toEqual(0);

        });

        it('should deduct points for repeat characters', function () {

            var strength = passwordStrengthService.repeatCharacters("aa");
            expect(strength).toEqual(-4);

            var strength = passwordStrengthService.repeatCharacters("aaa");
            expect(strength).toEqual(-14);

            var strength = passwordStrengthService.repeatCharacters("aaabbaaa");
            expect(strength).toEqual(-50);

            var strength = passwordStrengthService.repeatCharacters("aaaaaaaaaaaaaa");
            expect(strength).toEqual(-150);

            var strength = passwordStrengthService.repeatCharacters("9979979799");
            expect(strength).toEqual(-51);

            var strength = passwordStrengthService.repeatCharacters("9999999");
            expect(strength).toEqual(-60);

            var strength = passwordStrengthService.repeatCharacters("%%%");
            expect(strength).toEqual(-14);

        });

        it('should deduct points for consecutive uppercase characters', function () {

            var strength = passwordStrengthService.consecutiveUppercaseCharacters("aaAABA1%ccddDDDeeEhhHH"),
                count = (4 - 1) + (3 - 1) + (2 - 1);

            expect(strength).toEqual(-(count * 2));

        });

        it('should deduct points for consecutive lowercase characters', function () {

            var strength = passwordStrengthService.consecutiveLowercaseCharacters("aaAABA1%ccddDDDeeEhhHHh"),
                count = (2 - 1) + (4 - 1) + (2 - 1) + (2 - 1);

            expect(strength).toEqual(-(count * 2));

        });

        it('should deduct points for consecutive numbers', function () {

            var strength = passwordStrengthService.consecutiveNumbers("123aa45687aabb564%%asd55"),
                count = (3 - 1) + (5 - 1) + (3 - 1) + (2 - 1);

            expect(strength).toEqual(-(count * 2));

        });

        it('should deduct points for sequential characters', function () {

            // Alphabetical order
            var strength = passwordStrengthService.sequentialCharacters("abc");
            expect(strength).toEqual(-(1 * 6));

            var strength = passwordStrengthService.sequentialCharacters("cba");
            expect(strength).toEqual(-(1 * 6));

            // Alphabet order is deducted double when leetspeek is involved
            var strength = passwordStrengthService.sequentialCharacters("abcd");
            expect(strength).toEqual(-((2 + 1) * 6));

            var strength = passwordStrengthService.sequentialCharacters("dcba");
            expect(strength).toEqual(-((2 + 1) * 6));

            // Keyboard order are deducted double
            var strength = passwordStrengthService.sequentialCharacters("qwert");
            expect(strength).toEqual(-((3 + 3) * 6));

            var strength = passwordStrengthService.sequentialCharacters("trewq");
            expect(strength).toEqual(-((3 + 3) * 6));

        });

        it('should deduct points for sequential numbers', function () {

            var strength = passwordStrengthService.sequentialNumbers("123");
            expect(strength).toEqual(-(1 * 6));

            var strength = passwordStrengthService.sequentialNumbers("098");
            expect(strength).toEqual(-(1 * 6));

        });

        it('should deduct points for sequential symbols', function () {

            var strength = passwordStrengthService.sequentialSymbols("@#$");
            expect(strength).toEqual(-(1 * 2));

            var strength = passwordStrengthService.sequentialSymbols("$#@");
            expect(strength).toEqual(-(1 * 2));

        });

        it('should deduct points for words in the dictionary', function () {

            var strength = passwordStrengthService.dictionary("merlin");
            expect(strength).toEqual(-Infinity);

        });

    });

    it('should produce numbers in the bounds', function () {

        var strength = passwordStrengthService.bounds(-10);
        expect(strength).toEqual(0);

        var strength = passwordStrengthService.bounds(110);
        expect(strength).toEqual(100);

    });

});