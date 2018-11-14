declare namespace jasmine {
    interface Matchers<T> {
        toBeInstanceOf(cls: any): boolean;
    }
}

beforeEach(function() {
    jasmine.addMatchers(<jasmine.CustomMatcherFactories> {
        toBeInstanceOf: function(util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function(actual: any, expected: FunctionConstructor): jasmine.CustomMatcherResult {
                    let test = (actual instanceof expected);
                    return {
                        pass: test,
                        message: test
                            ? util.buildFailureMessage('toBeInstanceOf', true, actual, expected)
                            : null
                    };
                }
            };
        }
    });
});
