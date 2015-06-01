//jscs:disable disallowTrailingWhitespace
//jscs:disable disallowMultipleLineBreaks
var requireModule = require('requirefrom')('lib/modules'),
    chai = require('chai'),
    expect = chai.expect,
    multiline = require('multiline'),
    kssAdditionalParams = requireModule('kss-additional-params');

describe('Parsing KSS additional params', function() {

  it('Should parse from singleline-commented block', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
// sg-param:
// Value
      */
      }),
      // jscs:enable
      result = { 'sg-param': ' Value' },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('should parse windows linebreaks correctly', function() {
    // jscs:disable
    /*jshint -W109 */
    var str = "/*\r\n// sg-param:\r\n// Value\r\n*/\r\n",
      str2 = "/*\r// sg-param:\r// Value\r*/\r",
      result = { 'sg-param': ' Value' };
    // jscs:enable
    expect(kssAdditionalParams.get(str)).eql(result);
    expect(kssAdditionalParams.get(str2)).eql(result);
  });

  it('Should parse from multiline-commented block', function() {
    var str = '' +
        '/*\n' +
        ' sg-param:\n' +
        ' Value' +
        '*/',
      result = { 'sg-param': ' Value' },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('should parse multiple params', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
//sg-param1:
//Value1
//
//sg-param2:
//Value2
//
//sg-param3:
//Value3
      */
      }),
      // jscs:enable
      result = {
        'sg-param1': 'Value1',
        'sg-param2': 'Value2',
        'sg-param3': 'Value3'
      },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('should not detect parameters with spaces', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
//sg-param1:
//Value1
//
//with space:
//something
//
//sg-param2:
//Value2
      */
      }),
      // jscs:enable
      result = {
        'sg-param1': 'Value1\n\nwith space:\nsomething',
        'sg-param2': 'Value2'
      },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('should gulp different space combinations', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
// sg-param1 :
// Value1
//
//sg-param2:
// Value2
//
//   sg-param3:
// Value3
      */
      }),
      // jscs:enable
      result = {
        'sg-param1':' Value1',
        'sg-param2':' Value2',
        'sg-param3':' Value3'
      },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('Should ignore extra comments', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
// Something here
//
// sg-param1:
// Value1
//
//sg-param2:
// Value2
//
// sg-empty-param:
//
//   sg-param3:
// Value3
      */
      }),
      // jscs:enable
      result = {
        'sg-param1':' Value1',
        'sg-param2':' Value2',
        'sg-param3':' Value3'
      },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('should parse blocks that contains empty lines', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
// Something here
//
// sg-param1:
// Value1 part1
//
// Value1 part2
//
// sg-param2:
// Value2 part1
//
//
// Value2 part2
//
      */
      }),
      // jscs:enable
      result = {
        'sg-param1':' Value1 part1\n\n Value1 part2',
        'sg-param2':' Value2 part1\n\n\n Value2 part2'
      },
      params = kssAdditionalParams.get(str);

    expect(params).eql(result);
  });

  it('Should parse complex variables', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-angular-directive:
 name: sgAppTest
 template: demo/testDirective.html
 file: demo/testDirective.js
      */
      }),
      // jscs:enable
      result = {
        name: 'sgAppTest',
        file: 'demo/testDirective.js',
        template: 'demo/testDirective.html'
      },
      value = kssAdditionalParams.getValue('sg-angular-directive', str);

    expect(value).eql(result);
  });

  it('Should parse complex variables with 2 nexted values', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-angular-directive:
 name: sgAppTest
 template: demo/testDirective.html
 file: demo/testDirective.js
 file: demo/testDirective2.js
      */
      }),
      // jscs:enable
      result = {
        name: 'sgAppTest',
        file: [
          'demo/testDirective.js',
          'demo/testDirective2.js'
          ],
        template: 'demo/testDirective.html'
      },
      value = kssAdditionalParams.getValue('sg-angular-directive', str);

    expect(value).eql(result);
  });

  it('Should parse complex variables with many nexted values', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-angular-directive:
 name: sgAppTest
 template: demo/testDirective.html
 file: demo/testDirective.js
 file: demo/testDirective2.js
 file: demo/testDirective3.js
 file: demo/testDirective4.js
      */
      }),
      // jscs:enable
      result = {
        name: 'sgAppTest',
        file: [
          'demo/testDirective.js',
          'demo/testDirective2.js',
          'demo/testDirective3.js',
          'demo/testDirective4.js'
          ],
        template: 'demo/testDirective.html'
      },
      value = kssAdditionalParams.getValue('sg-angular-directive', str);
    expect(value).eql(result);
  });

  it('Should parse complex variables with comma notation', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-angular-directive:
 name: sgAppTest
 template: demo/testDirective.html
 file: demo/testDirective.js, demo/testDirective2.js
      */
      }),
      // jscs:enable
      result = {
        name: 'sgAppTest',
        file: [
          'demo/testDirective.js',
          'demo/testDirective2.js'
          ],
        template: 'demo/testDirective.html'
      },
      value = kssAdditionalParams.getValue('sg-angular-directive', str);
    expect(value).eql(result);
  });

  it('Should ignore extra spaces when parsing complex variables', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-angular-directive:
 name: sgAppTest
 template:  demo/testDirective.html
 file:   demo/testDirective.js , demo/testDirective2.js
 file:   demo/testDirective3.js
      */
      }),
      // jscs:enable
      result = {
        name: 'sgAppTest',
        file: [
          'demo/testDirective.js',
          'demo/testDirective2.js',
          'demo/testDirective3.js'
          ],
        template: 'demo/testDirective.html'
      },
      value = kssAdditionalParams.getValue('sg-angular-directive', str);
    expect(value).eql(result);
  });

  it('Should parse only listed params as comples', function() {
    // jscs:disable
    var str = multiline(function() {
      /*
 sg-another-custom-param:
 param1: val1
 param2: val2
      */
      }),
      result = multiline(function() {
      /*
 param1: val1
 param2: val2
      */
      }),
      value = kssAdditionalParams.getValue('sg-another-custom-param', str);
    // jscs:enable
    expect(value).eql(result);
  });
});
