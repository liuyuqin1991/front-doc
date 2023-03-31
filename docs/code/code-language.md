---
nav: 代码规范
group:
  title: 基础
  order: 2
order: 1
---

# 语言规范

语言规范使用 ES6+风格，避免使用 ES5 及以下的语法糖

## 自动规范

#### 格式化配置

启用 Vetur 插件的 format on save 配置，能够在保存时自动进行格式化规范，可规范的内容有：1. 缩进；2. 换行；3. 空格；4. 括号

1. 添加配置，并设置 vetur 的所有格式风格为 prettier

```
  // vscode setting.json加入
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur",
    "editor.tabSize": 2,
    "editor.formatOnSave": true,
  },
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      // 使用单引号代替双引号
      "singleQuote": true,
      // 句尾添加分号
      "semi": false,
      // 末尾逗号
      "trailingComma": "none"
    }
  }
```

:::warning{title=警告}
如 format 失效，请检查配置，关闭 vscode 自带的 format 或其他插件如 format on save
:::

#### 校验配置

1. 打开 <b>Eslint 插件</b> 校验
2. 打开 <b>Code Spell Checker 插件</b> 单词拼写校验

## 人工规范

1. [类型](#一类型)
2. [对象](#二对象)
3. [数组](#三数组)
4. [解构](#四解构)
5. [字符串](#五字符串)
6. [函数](#六函数)
7. [箭头函数](#七箭头函数)
8. [模块](#八模块)
9. [迭代器](#九迭代器和生成器)
10. [属性](#十属性)
11. [变量](#十一变量)
12. [比较运算符 & 相等](#十二比较运算符相等)
13. [注释](#十三注释)
14. [类型转换](#十四类型转换)
15. [命名规则](#十五命名规则)
16. [存取器](#十六存取器)
17. [事件](#十七事件)
18. [异常](#十八异常)
19. [标准库](#十九标准库)
20. [性能](#二十性能)
21. [资源](#二十一资源)

## 一、类型

<a name="types--primitives"></a><a name="1.1"></a>

- [1.1](#types--primitives) **原始类型**: 存取原始类型直接作用于值本身.

  - `string`
  - `number`
  - `boolean`
  - `null`
  - `undefined`
  - `symbol`

  ```javascript
  const foo = 1;
  let bar = foo;

  bar = 9;

  console.log(foo, bar); // => 1, 9
  ```

  - Symbols 不能被完全 polyfill,所以不能用于无法被原生支持该特性的浏览器/环境.

<a name="types--complex"></a><a name="1.2"></a>

- [1.2](#types--complex) **复杂类型**: 访问复杂类型作用于值的引用.

  - `object`
  - `array`
  - `function`

  ```javascript
  const foo = [1, 2];
  const bar = foo;

  bar[0] = 9;

  console.log(foo[0], bar[0]); // => 9, 9
  ```

**[⬆ back to top](#人工规范)**

## 二、对象

<a name="objects--no-new"></a><a name="2.1"></a>

- [2.1](#objects--no-new) 使用字面语法创建对象. eslint: [`no-new-object`](http://eslint.org/docs/rules/no-new-object.html)

  ```javascript
  // bad
  const item = new Object();

  // good
  const item = {};
  ```

<a name="es6-computed-properties"></a><a name="3.2"></a>

- [2.2](#es6-computed-properties) 创建动态属性名字的对象时使用计算后的属性名，在一个地方定义一个对象的全部属性

  ```javascript
  function getKey(k) {
    return `a key named ${k}`;
  }

  // bad
  const obj = {
    id: 5,
    name: 'San Francisco',
  };
  obj[getKey('enabled')] = true;

  // good
  const obj = {
    id: 5,
    name: 'San Francisco',
    [getKey('enabled')]: true,
  };
  ```

<a name="es6-object-shorthand"></a><a name="2.3"></a>

- [2.3](#es6-object-shorthand) 使用对象方法的简写形式. eslint: [`object-shorthand`](http://eslint.org/docs/rules/object-shorthand.html)

  ```javascript
  // bad
  const atom = {
    value: 1,

    addValue: function (value) {
      return atom.value + value;
    },
  };

  // good
  const atom = {
    value: 1,

    addValue(value) {
      return atom.value + value;
    },
  };
  ```

<a name="es6-object-concise"></a><a name="2.4"></a>

- [2.4](#es6-object-concise) 使用简写属性值. eslint: [`object-shorthand`](http://eslint.org/docs/rules/object-shorthand.html)

  ```javascript
  const bus = 'bus';

  // bad
  const obj = {
    bus: bus,
  };

  // good
  const obj = {
    bus,
  };
  ```

<a name="objects--grouped-shorthand"></a><a name="2.5"></a>

- [2.5](#objects--grouped-shorthand) 将简写的属性统一放到对象声明开头.

  > 原因：容易区分使用简写的属性.

  ```javascript
  const bus = 'bus';
  const car = 'car';

  // bad
  const obj = {
    busOne: 1,
    busTwo: 2,
    bus,
    carThree: 3,
    carFour: 4,
    car,
  };

  // good
  const obj = {
    bus,
    car,
    busOne: 1,
    busTwo: 2,
    carThree: 3,
    carFour: 4,
  };
  ```

<a name="objects--quoted-props"></a><a name="2.6"></a>

- [2.6](#objects--quoted-props) 只对非法标识符的属性使用引号. eslint: [`quote-props`](http://eslint.org/docs/rules/quote-props.html)

> 原因：通常我们主观上认为更易读.有利于语法高亮，更容易被许多 JS 引擎优化.

```javascript
// bad
const bad = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```

<a name="objects--rest-spread"></a>

- [2.7](#objects--rest-spread) 优先使用对象展开运算符而不是对象浅拷贝[`Object.assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). 使用对象剩余运算符来获得新的有具体被省略属性的对象.

      ```javascript
      // very bad
      const original = { a: 1, b: 2 };
      const copy = Object.assign(original, { c: 3 }); // this mutates `original` ಠ_ಠ
      delete copy.a; // so does this

      // bad
      const original = { a: 1, b: 2 };
      const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

      // good
      const original = { a: 1, b: 2 };
      const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

      const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
      ```

  **[⬆ back to top](#人工规范)**

## 三、数组

<a name="arrays--literals"></a><a name="3.1"></a>

- [3.1](#arrays--literals) 使用字面量语法创建数组. eslint: [`no-array-constructor`](http://eslint.org/docs/rules/no-array-constructor.html)

  ```javascript
  // bad
  const items = new Array();

  // good
  const items = [];
  ```

<a name="arrays--push"></a><a name="3.2"></a>

- [3.2](#arrays--push) 使用 [Array#push](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 而不是直接给数组添加新项.

  ```javascript
  const someStack = [];

  // bad
  someStack[someStack.length] = 'abracadabra';

  // good
  someStack.push('abracadabra');
  ```

<a name="es6-array-spreads"></a><a name="3.3"></a>

- [3.3](#es6-array-spreads) 使用数组扩展运算符 `...` 拷贝数组.

  ```javascript
  // bad
  const len = items.length;
  const itemsCopy = [];
  let i;

  for (i = 0; i < len; i++) {
    itemsCopy[i] = items[i];
  }

  // good
  const itemsCopy = [...items];
  ```

<a name="arrays--from"></a><a name="3.4"></a>

- [3.4](#arrays--from) 将可迭代对象转换成数组使用扩展运算符`...`而不是[Array.from](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from).

  ```javascript
  const foo = document.querySelectorAll('.foo');

  // good
  const nodes = Array.from(foo);

  // best
  const nodes = [...foo];
  ```

  <a name="arrays--from-array-like"></a>

- [3.5](#arrays--from-array-like) 使用 [`Array.from`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from) 方法将类数组对象转化成数组.

  ```javascript
  const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };

  // bad
  const arr = Array.prototype.slice.call(arrLike);

  // good
  const arr = Array.from(arrLike);
  ```

<a name="arrays--callback-return"></a><a name="3.6"></a>

- [3.6](#arrays--callback-return) 在数组方法的回调函数中使用 return.如果函数体只有一条返回没有副作用的声明则可以省略 return, 遵循 [8.2](#arrows--implicit-return). eslint: [`array-callback-return`](http://eslint.org/docs/rules/array-callback-return)

  ```javascript
  // bad
  [1, 2, 3].map(x => return x + 1);

  // good
  [1, 2, 3].map(x => x + 1);
  ```

**[⬆ back to top](#人工规范)**

## 四、解构（重要）

<a name="destructuring--object"></a><a name="4.1"></a>

- [4.1](#destructuring--object) 访问对象的多个属性时使用对象解构. eslint: [`prefer-destructuring`](https://eslint.org/docs/rules/prefer-destructuring)

  > 原因：解构可以避免创建属性的临时引用.

  ```javascript
  // bad
  function getFullName(user) {
    const firstName = user.firstName;
    const lastName = user.lastName;

    return `${firstName} ${lastName}`;
  }

  // good
  function getFullName(user) {
    const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
  }

  // best 当只使用参数中的三个以内的参数，直接在形参中解构
  function getFullName({ firstName, lastName }) {
    return `${firstName} ${lastName}`;
  }
  ```

<a name="destructuring--array"></a><a name="4.2"></a>

- [4.2](#destructuring--array) 使用数组解构. eslint: [`prefer-destructuring`](https://eslint.org/docs/rules/prefer-destructuring)

  ```javascript
  const arr = [1, 2, 3, 4];

  // bad
  const first = arr[0];
  const second = arr[1];

  // good
  const [first, second] = arr;
  ```

<a name="destructuring--object-over-array"></a><a name="4.3"></a>

- [4.3](#destructuring--object-over-array) 对于多个返回值使用对象解构而不是数组解构.在设计 function 的形参及回参时多注意这方面

  > 原因：可以非破坏性地随时增加或者改变属性顺序.

  ```javascript
  // bad
  function processInput(input) {
    // then a miracle occurs
    return [left, right, top, bottom];
  }

  // the caller needs to think about the order of return data
  const [left, __, top] = processInput(input);

  // good
  function processInput(input) {
    // then a miracle occurs
    return { left, right, top, bottom };
  }

  // the caller selects only the data they need
  const { left, top } = processInput(input);
  ```

**[⬆ back to top](#人工规范)**

## 五、字符串(重要)

<a name="strings--quotes"></a><a name="5.1"></a>

- [5.1](#strings--quotes) 字符串使用单引号 `''` . eslint: [`quotes`](http://eslint.org/docs/rules/quotes.html)

  ```javascript
  // bad
  const name = 'Capt. Janeway';

  // bad - template literals should contain interpolation or newlines
  const name = `Capt. Janeway`;

  // good
  const name = 'Capt. Janeway';
  ```

<a name="es6-template-literals"></a><a name="5.2"></a>

- [5.2](#es6-template-literals) 动态构建字符串时使用模板字符串而不是拼接. eslint: [`prefer-template`](http://eslint.org/docs/rules/prefer-template.html) [`template-curly-spacing`](http://eslint.org/docs/rules/template-curly-spacing)

  > 原因：模板字符串有可读性强，语法明确，换行合理和字符串插值的特点.

  ```javascript
  // bad
  function sayHi(name) {
    return 'How are you, ' + name + '?';
  }

  // bad
  function sayHi(name) {
    return ['How are you, ', name, '?'].join();
  }

  // bad
  function sayHi(name) {
    return `How are you, ${name}?`;
  }

  // good
  function sayHi(name) {
    return `How are you, ${name}?`;
  }
  ```

<a name="strings--eval"></a><a name="6.4"></a>

- [5.3](#strings--eval) 不要对字符串使用`eval()`，漏洞太多. eslint: [`no-eval`](https://eslint.org/docs/rules/no-eval)

<a name="strings--escaping"></a>

- [5.4](#strings--escaping) 不要在字符串中使用不必要的转义字符. eslint: [`no-useless-escape`](http://eslint.org/docs/rules/no-useless-escape)

  > 原因：反斜线不利于阅读，应该只在必要的时候出现.

  ```javascript
  // bad
  const foo = '\'this\' is "quoted"';

  // good
  const foo = '\'this\' is "quoted"';
  const foo = `my name is '${name}'`;
  ```

**[⬆ back to top](#人工规范)**

## 六、函数

<a name="functions--note-on-blocks"></a><a name="6.1"></a>

- [6.1](#functions--note-on-blocks) **注意:** ECMA-262 定义了`block`作为一组语句的块. 函数声明不是语句. [Read ECMA-262's note on this issue](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf#page=97).

  ```javascript
  // bad
  if (currentUser) {
    function test() {
      console.log('Nope.');
    }
  }

  // good
  let test;
  if (currentUser) {
    test = () => {
      console.log('Yup.');
    };
  }
  ```

<a name="functions--arguments-shadow"></a><a name="6.2"></a>

- [6.2](#functions--arguments-shadow) 不要将参数命名为 `arguments`. 会导致该参数的优先级高于每个函数作用域内原先存在的`arguments`对象.

  ```javascript
  // bad
  function foo(name, options, arguments) {
    // ...
  }

  // good
  function foo(name, options, args) {
    // ...
  }
  ```

<a name="es6-rest"></a><a name="6.3"></a>

- [6.3](#es6-rest) 不要使用 `arguments`, 使用其余运算符 `...` . eslint: [`prefer-rest-params`](http://eslint.org/docs/rules/prefer-rest-params)

  > 原因：`...`是你想获得的参数列表，因此，扩展语法的参数是真正的数组，而`arguments`是类数组.

  ```javascript
  // bad
  function concatenateAll() {
    const args = Array.prototype.slice.call(arguments);
    return args.join('');
  }

  // good
  function concatenateAll(...args) {
    return args.join('');
  }
  ```

<a name="es6-default-parameters"></a><a name="6.4"></a>

- [6.4](#es6-default-parameters) 使用参数默认值语法而不是修改函数参数.

  ```javascript
  // really bad
  function handleThings(opts) {
    // No! We shouldn't mutate function arguments.
    // Double bad: if opts is falsy it'll be set to an object which may
    // be what you want but it can introduce subtle bugs.
    opts = opts || {};
    // ...
  }

  // still bad
  function handleThings(opts) {
    if (opts === void 0) {
      opts = {};
    }
    // ...
  }

  // good
  function handleThings(opts = {}) {
    // ...
  }
  ```

<a name="functions--default-side-effects"></a><a name="6.5"></a>

- [6.5](#functions--default-side-effects) 避免参数默认值的副作用.

  > 原因：难以理解.

  ```javascript
  let b = 1;
  // bad
  function count(a = b++) {
    console.log(a);
  }
  count(); // 1
  count(); // 2
  count(3); // 3
  count(); // 3
  ```

<a name="functions--defaults-last"></a><a name="6.6"></a>

- [6.6](#functions--defaults-last) 将参数默认值放在最后.

  ```javascript
  // bad
  function handleThings(opts = {}, name) {
    // ...
  }

  // good
  function handleThings(name, opts = {}) {
    // ...
  }
  ```

<a name="functions--constructor"></a><a name="6.7"></a>

- [6.7](#functions--constructor) 不要使用 Function 构造函数创建函数. eslint: [`no-new-func`](http://eslint.org/docs/rules/no-new-func)

  > 原因：此方式创建函数和对字符串使用 eval()一样会产生漏洞.

  ```javascript
  // bad
  const add = new Function('a', 'b', 'return a + b');

  // still bad
  const subtract = Function('a', 'b', 'return a - b');
  ```

<a name="functions--mutate-params"></a><a name="6.8"></a>

- [6.8](#functions--mutate-params) 不要直接改变传入的参数. eslint: [`no-param-reassign`](http://eslint.org/docs/rules/no-param-reassign.html)

  > 原因：操作作为参数传入的对象可能在原始调用中造成意想不到的变量副作用.

  ```javascript
  // bad
  function f1(obj) {
    obj.key = 1;
  }

  // good
  function f2(obj) {
    const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
  }
  ```

<a name="functions--reassign-params"></a><a name="6.9"></a>

- [6.9](#functions--reassign-params) 不要给参数重新赋值. eslint: [`no-param-reassign`](http://eslint.org/docs/rules/no-param-reassign.html)

  > 原因：参数重新赋值可能会导致无法预期的行为，尤其是当操作`arguments`对象时.也可能导致优化问题，尤其是在 V8 引擎中

  ```javascript
  // bad
  function f1(a) {
    a = 1;
  }

  function f2(a) {
    if (!a) {
      a = 1;
    }
  }

  // good
  function f3(a) {
    const b = a || 1;
  }

  function f4(a = 1) {}
  ```

<a name="functions--spread-vs-apply"></a><a name="6.10"></a>

- [6.10](#functions--spread-vs-apply) 调用可变参数函数时建议使用展开运算符`...`. eslint: [`prefer-spread`](http://eslint.org/docs/rules/prefer-spread)

      > 原因：显然你无需使用上下文，很难结合`new`和`apply`.

      ```javascript
      // bad
      const x = [1, 2, 3, 4, 5];
      console.log.apply(console, x);

      // good
      const x = [1, 2, 3, 4, 5];
      console.log(...x);

      // bad
      new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

      // good
      new Date(...[2016, 8, 5]);
      ```

  **[⬆ back to top](#人工规范)**

## 七、箭头函数

<a name="arrows--use-them"></a><a name="7.1"></a>

- [7.1](#arrows--use-them) 当你必须使用函数表达式（传递匿名函数）时，使用箭头函数标记. eslint: [`prefer-arrow-callback`](http://eslint.org/docs/rules/prefer-arrow-callback.html), [`arrow-spacing`](http://eslint.org/docs/rules/arrow-spacing.html)

      > 原因：这会创建一个能在其中使用`this`上下文的函数，这是你想要的，语法也更明确.

      ```javascript
      // bad
      [1, 2, 3].map(function (x) {
        const y = x + 1;
        return x * y;
      });

      // good
      [1, 2, 3].map((x) => {
        const y = x + 1;
        return x * y;
      });
      ```

  **[⬆ back to top](#人工规范)**

## 八、模块

<a name="modules--use-them"></a><a name="8.1"></a>

- [8.1](#modules--use-them) 在非标准模块系统的基础上使用模块 (`import`/`export`) . 你可以将其转化为你更喜欢的模块系统.

  > 原因：模块是未来，让我们现在开始使用未来的特性.

  ```javascript
  // bad
  const AirbnbStyleGuide = require('./AirbnbStyleGuide');
  module.exports = AirbnbStyleGuide.es6;

  // ok
  import AirbnbStyleGuide from './AirbnbStyleGuide';
  export default AirbnbStyleGuide.es6;

  // best
  import { es6 } from './AirbnbStyleGuide';
  export default es6;
  ```

<a name="modules--no-wildcard"></a><a name="8.2"></a>

- [8.2](#modules--no-wildcard) 不要使用通配符导入.

  > 原因：这会确保你只有一个默认的 export.

  ```javascript
  // bad
  import * as AirbnbStyleGuide from './AirbnbStyleGuide';

  // good
  import AirbnbStyleGuide from './AirbnbStyleGuide';
  ```

<a name="modules--no-export-from-import"></a><a name="8.3"></a>

- [8.3](#modules--no-export-from-import) 不要直接 export 从 import 中导入的模块.

  > 原因：很显然有一个明确的方法来 import 和 export 会保持一致性.

  ```javascript
  // bad
  // filename es6.js
  export { es6 as default } from './airbnbStyleGuide';

  // good
  // filename es6.js
  import { es6 } from './AirbnbStyleGuide';
  export default es6;
  ```

<a name="modules--no-duplicate-imports"></a><a name="8.4"></a>

- [8.4](#modules--no-duplicate-imports) 只允许在一个地方从一个路径 import.
  eslint: [`no-duplicate-imports`](http://eslint.org/docs/rules/no-duplicate-imports)

  > 原因：有多行同一个路径的 import 会使代码更难维护.

  ```javascript
  // bad
  import foo from 'foo';
  // … some other imports … //
  import { named1, named2 } from 'foo';

  // good
  import foo, { named1, named2 } from 'foo';

  // good
  import foo, { named1, named2 } from 'foo';
  ```

<a name="modules--prefer-default-export"></a><a name="8.5"></a>

- [8.5](#modules--prefer-default-export) 在单一 export 的模块中，建议 export default 而不是具名 export.
  eslint: [`import/prefer-default-export`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md)

  > 原因：建议更多的文件只有一个 export 出口.有利于维护和阅读.

  ```javascript
  // bad
  export function foo() {}

  // good
  export default function foo() {}
  ```

<a name="modules--imports-first"></a><a name="8.6"></a>

- [8.6](#modules--imports-first) 将所有的`import`放在非`import`语句前.
  eslint: [`import/imports-first`](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/imports-first.md) > 原因：由于`import`会被提前，将其全部置于顶部会避免意外行为.

      ```javascript
      // bad
      import foo from 'foo';
      foo.init();

      import bar from 'bar';

      // good
      import foo from 'foo';
      import bar from 'bar';

      foo.init();
      ```

  **[⬆ back to top](#人工规范)**

## 九、迭代器

<a name="iterators--nope"></a><a name="9.1"></a>

- [9.1](#iterators--nope) 不要使用迭代器.建议使用 JS 更高优先级的函数代替`for-in` 或 `for-of`循环. eslint: [`no-iterator`](http://eslint.org/docs/rules/no-iterator.html) [`no-restricted-syntax`](http://eslint.org/docs/rules/no-restricted-syntax)

  > 使用 `map()` / `every()` / `filter()` / `find()` / `findIndex()` / `reduce()` / `some()` / ... 来遍历数组, 用 `Object.keys()` / `Object.values()` / `Object.entries()` 来制造数组以便能对对象进行迭代，最好是使用 lodash 工具库里的方法。

  ```javascript
  const numbers = [1, 2, 3, 4, 5];

  // bad
  let sum = 0;
  for (let num of numbers) {
    sum += num;
  }

  sum === 15;

  // good
  let sum = 0;
  numbers.forEach((num) => {
    sum += num;
  });
  sum === 15;

  // bad
  const increasedByOne = [];
  for (let i = 0; i < numbers.length; i++) {
    increasedByOne.push(numbers[i] + 1);
  }

  // good
  const increasedByOne = [];
  numbers.forEach((num) => {
    increasedByOne.push(num + 1);
  });

  // best (keeping it functional)
  const increasedByOne = numbers.map((num) => num + 1);
  ```

**[⬆ back to top](#人工规范)**

## 十、属性

<a name="properties--dot"></a><a name="10.1"></a>

- [10.1](#properties--dot) 访问属性时使用`.`. eslint: [`dot-notation`](http://eslint.org/docs/rules/dot-notation.html)

  ```javascript
  const luke = {
    jedi: true,
    age: 28,
  };

  // bad
  const isJedi = luke['jedi'];

  // good
  const isJedi = luke.jedi;
  ```

<a name="properties--bracket"></a><a name="10.2"></a>

- [10.2](#properties--bracket) 当访问的属性是变量时使用 `[]` .

      ```javascript
      const luke = {
        jedi: true,
        age: 28,
      };

      function getProp(prop) {
        return luke[prop];
      }

      const isJedi = getProp('jedi');
      ```

  **[⬆ back to top](#人工规范)**

## 十一、变量

<a name="variables--const"></a><a name="11.1"></a>

- [11.1](#variables--const) 每个变量声明必须使用 `const` 或者 `let` . 不这么做会导致全局变量问题. 要避免污染全局命名空间.eslint: [`no-undef`](http://eslint.org/docs/rules/no-undef) [`prefer-const`](http://eslint.org/docs/rules/prefer-const)

  ```javascript
  // bad
  const superPower = new SuperPower();

  // good
  const superPower = new SuperPower();
  ```

<a name="variables--const-let-group"></a><a name="11.2"></a>

- [11.2](#variables--const-let-group) 将 `const` 和 `let` 分别放到一起，如互不依赖，则 const 优先

  ```javascript
  // bad
  let i,
    len,
    dragonball,
    items = getItems(),
    goSportsTeam = true;

  // bad
  let i;
  const items = getItems();
  let dragonball;
  const goSportsTeam = true;
  let len;

  // good
  const goSportsTeam = true;
  const items = getItems();
  let dragonball;
  let i;
  let length;
  ```

<a name="variables--define-where-used"></a><a name="11.3"></a>

- [11.3](#variables--define-where-used) 在需要的地方给变量赋值，但位置要合理.

  > 原因：`let` 和 `const` 是块级作用域而不是函数级作用域.

  ```javascript
  // bad - unnecessary function call
  function checkName(hasName) {
    const name = getName();

    if (hasName === 'test') {
      return false;
    }

    if (name === 'test') {
      this.setName('');
      return false;
    }

    return name;
  }

  // good
  function checkName(hasName) {
    if (hasName === 'test') {
      return false;
    }

    const name = getName();

    if (name === 'test') {
      this.setName('');
      return false;
    }

    return name;
  }
  ```

  <a name="variables--no-chain-assignment"></a><a name="11.4"></a>

- [11.4](#variables--no-chain-assignment) 变量不要进行链式赋值.

  > 原因：变量链式赋值会创建隐藏的全局变量.

  ```javascript
  // bad
  (function example() {
    // JavaScript interprets this as
    // let a = ( b = ( c = 1 ) );
    // The let keyword only applies to variable a; variables b and c become
    // global variables.
    let a = (b = c = 1);
  })();

  console.log(a); // throws ReferenceError
  console.log(b); // 1
  console.log(c); // 1

  // good
  (function example() {
    let a = 1;
    let b = a;
    let c = a;
  })();

  console.log(a); // throws ReferenceError
  console.log(b); // throws ReferenceError
  console.log(c); // throws ReferenceError

  // the same applies for `const`
  ```

<a name="variables--unary-increment-decrement"></a><a name="11.5"></a>

- [11.5](#variables--unary-increment-decrement) 避免使用自增和自减一元运算符 (++, --). eslint [`no-plusplus`](http://eslint.org/docs/rules/no-plusplus)

  > 原因:根据 eslint 文档,自增和自减一元运算符受到分号自动插入的影响可能在应用内部引发自增和自减值的隐蔽错误.用像`num += 1`的语句而不是`num++`或`num ++`来修改值更有表达力.禁止一元自增和自减语句也避免了前置自增/前置自减值在程序中引起的不可预期的行为的副作用.

  ```javascript
  // bad

  const array = [1, 2, 3];
  let num = 1;
  num++;
  --num;

  let sum = 0;
  let truthyCount = 0;
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    sum += value;
    if (value) {
      truthyCount++;
    }
  }

  // good

  const array = [1, 2, 3];
  let num = 1;
  num += 1;
  num -= 1;

  const sum = array.reduce((a, b) => a + b, 0);
  const truthyCount = array.filter(Boolean).length;
  ```

<a name="variables--no-unused-vars"></a><a name="11.6"></a>

- [11.6](#variables--no-unused-vars)不允许出现未被使用的变量. eslint: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars)

  > 原因：声明但未被使用的变量通常是不完全重构犯下的错误.这种变量在代码里浪费空间并会给读者造成困扰.

  ```javascript
  // bad

  const some_unused_var = 42;

  // Write-only variables are not considered as used.
  let y = 10;
  y = 5;

  // A read for a modification of itself is not considered as used.
  let z = 0;
  z = z + 1;

  // Unused function arguments.
  function getX(x, y) {
    return x;
  }

  // good

  function getXPlusY(x, y) {
    return x + y;
  }

  const x = 1;
  const y = a + 2;

  alert(getXPlusY(x, y));
  ```

**[⬆ back to top](#人工规范)**

## 十二、比较运算符&相等

<a name="comparison--eqeqeq"></a><a name="12.1"></a>

- [12.1](#comparison--eqeqeq) 使用 `===` 和 `!==`而非 `==` 和 `!=`. eslint: [`eqeqeq`](http://eslint.org/docs/rules/eqeqeq.html)

<a name="comparison--if"></a><a name="12.2"></a>

- [12.2](#comparison--if) 条件声明例如 `if` 会用 `ToBoolean` 这个抽象方法将表达式转成布尔值并遵循如下规则:

  - **Objects** 等于 **true**
  - **Undefined** 等于 **false**
  - **Null** 等于 **false**
  - **Booleans** 等于 **布尔值**
  - **Numbers** 在 **+0, -0, or NaN**的情况下等于**false**, 其他情况是 **true**
  - **Strings** 为`''`时等于 **false** , 否则是 **true**

  ```javascript
  if ([0] && []) {
    // true
    // 数组(即使是空数组)也是对象，对象等于true
  }
  ```

<a name="comparison--shortcuts"></a><a name="12.3"></a>

- [12.3](#comparison--shortcuts) 对于布尔值使用简写，但对于字符串和数字要显式比较.

  ```javascript
  // bad
  if (isValid === true) {
    // ...
  }

  // good
  if (isValid) {
    // ...
  }

  // bad
  if (name) {
    // ...
  }

  // good
  if (name !== '') {
    // ...stuff...
  }

  // bad
  if (collection.length) {
    // ...
  }

  // good
  if (collection.length > 0) {
    // ...
  }
  ```

<a name="comparison--switch-blocks"></a><a name="12.4"></a>

- [12.4](#comparison--switch-blocks) 在用 `case` 和 `default` 语句创建的包含有如下词语(如 `let`, `const`, `function` 和 `class`)的代码块中使用花括号.eslint rules [`no-case-declarations`](http://eslint.org/docs/rules/no-case-declarations.html).

  > 原因：这些词语在整个`switch`中可见但是仅仅在当执行到`case`时被赋值的时候初始化.当多条`case`语句试图定义同一个变量时会导致问题.

  ```javascript
  // bad
  switch (foo) {
    case 1:
      let x = 1;
      break;
    case 2:
      const y = 2;
      break;
    case 3:
      function f() {}
      break;
    default:
      class C {}
  }

  // good
  switch (foo) {
    case 1: {
      let x = 1;
      break;
    }
    case 2: {
      const y = 2;
      break;
    }
    case 3: {
      function f() {}
      break;
    }
    case 4:
      bar();
      break;
    default: {
      class C {}
    }
  }
  ```

<a name="comparison--nested-ternaries"></a><a name="12.5"></a>

- [12.5](#comparison--nested-ternaries) 通常三元运算是单行表达式,不应该被嵌套. eslint: [`no-nested-ternary`](http://eslint.org/docs/rules/no-nested-ternary.html).

  ```javascript
  // bad
  const foo = maybe1 > maybe2 ? 'bar' : value1 > value2 ? 'baz' : null;

  // better
  const maybeNull = value1 > value2 ? 'baz' : null;

  const foo = maybe1 > maybe2 ? 'bar' : maybeNull;

  // best
  const maybeNull = value1 > value2 ? 'baz' : null;

  const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
  ```

<a name="comparison--unneeded-ternary"></a><a name="12.6"></a>

- [12.6](#comparison--unneeded-ternary) 避免不必要的三元运算符.

  eslint rules: [`no-unneeded-ternary`](http://eslint.org/docs/rules/no-unneeded-ternary.html).

  ```javascript
  // bad
  const foo = a ? a : b;
  const bar = c ? true : false;
  const baz = c ? false : true;

  // good
  const foo = a || b;
  const bar = !!c;
  const baz = !c;
  ```

  <a name="comparison--no-mixed-operators"></a><a name="12.7"></a>

- [12.7](#comparison--no-mixed-operators)声明语句中有多个运算符时用圆括号包裹运算符. 唯一例外是标准算数运算符 (`+`, `-`, `*`, & `/`) 因为它们的优先级基本都知道. eslint: [`no-mixed-operators`](https://eslint.org/docs/rules/no-mixed-operators.html)

  > 原因. 提高可读性并表明了开发者的意图.

  ```javascript
  // bad
  const foo = (a && b < 0) || c > 0 || d + 1 === 0;

  // bad
  const bar = a ** b - (5 % d);

  // bad
  // one may be confused into thinking (a || b) && c
  if (a || (b && c)) {
    return d;
  }

  // good
  const foo = (a && b < 0) || c > 0 || d + 1 === 0;

  // good
  const bar = a ** b - (5 % d);

  // good
  if (a || (b && c)) {
    return d;
  }

  // good
  const bar = a + (b / c) * d;
  ```

**[⬆ back to top](#人工规范)**

## 十三、注释

<a name="comments--multiline"></a><a name="13.1"></a>

- [13.1](#comments--multiline) 多行注释使用 `/** ... */` .

  ```javascript
  // bad
  // make() returns a new element
  // based on the passed in tag name
  //
  // @param {String} tag
  // @return {Element} element
  function make(tag) {
    // ...stuff...

    return element;
  }

  // good
  /**
   * make() returns a new element
   * based on the passed in tag name
   */
  function make(tag) {
    // ...

    return element;
  }
  ```

<a name="comments--singleline"></a><a name="13.2"></a>

- [13.2](#comments--singleline) 单行注释使用 `//`. 在要注释部分的上边一行放置注释. 如果不是块的第一行则在注释前留一个空行.

  ```javascript
  // bad
  const active = true; // is current tab

  // good
  // is current tab
  const active = true;

  // bad
  function getType() {
    console.log('fetching type...');
    // set the default type to 'no type'
    const type = this._type || 'no type';

    return type;
  }

  // good
  function getType() {
    console.log('fetching type...');

    // set the default type to 'no type'
    const type = this._type || 'no type';

    return type;
  }

  // also good
  function getType() {
    // set the default type to 'no type'
    const type = this._type || 'no type';

    return type;
  }
  ```

  <a name="comments--spaces"></a><a name="13.3"></a>

- [13.3](#comments--spaces)所有注释都要以空格开头便于阅读. eslint: [`spaced-comment`](http://eslint.org/docs/rules/spaced-comment)

  ```javascript
  // bad
  //is current tab
  const active = true;

  // good
  // is current tab
  const active = true;

  // bad
  /**
   *make() returns a new element
   *based on the passed-in tag name
   */
  function make(tag) {
    // ...

    return element;
  }

  // good
  /**
   * make() returns a new element
   * based on the passed-in tag name
   */
  function make(tag) {
    // ...

    return element;
  }
  ```

<a name="comments--actionitems"></a><a name="13.4"></a>

- [13.4](#comments--actionitems) 如果想表明这个问题以后会再次被查看或者给出了这个问题的解决方案，在注释前加上前缀`FIXME`或者`TODO`会有利于其他开发者很快理解问题. 这些不同于一般的注释因为它们是可操作的. 操作是 `FIXME: -- need to figure this out` 或 `TODO: -- need to implement`.

<a name="comments--fixme"></a><a name="13.5"></a>

- [13.5](#comments--fixme)使用 `// FIXME:` 来标注问题.

  ```javascript
  class Calculator extends Abacus {
    constructor() {
      super();

      // FIXME: shouldn't use a global here
      total = 0;
    }
  }
  ```

<a name="comments--todo"></a><a name="13.6"></a>

- [13.6](#comments--fixme)使用 `// TODO:` 来标明问题的解决方案.

  ```javascript
  class Calculator extends Abacus {
    constructor() {
      super();

      // TODO: total should be configurable by an options param
      this.total = 0;
    }
  }
  ```

**[⬆ back to top](#人工规范)**

## 十四、类型转换

<a name="coercion--explicit"></a><a name="14.1"></a>

- [14.1](#coercion--explicit)在声明的开始部分进行类型强转.

<a name="coercion--strings"></a><a name="14.2"></a>

- [14.2](#coercion--strings)字符串: [`no-new-wrappers`](https://eslint.org/docs/rules/no-new-wrappers)

  ```javascript
  // => this.reviewScore = 9;

  // bad
  const totalScore = new String(this.reviewScore); // typeof totalScore is "object" not "string"

  // bad
  const totalScore = this.reviewScore + ''; // invokes this.reviewScore.valueOf()

  // bad
  const totalScore = this.reviewScore.toString(); // isn't guaranteed to return a string

  // good
  const totalScore = String(this.reviewScore);
  ```

<a name="coercion--numbers"></a><a name="14.3"></a>

- [14.3](#coercion--numbers)数字: 使用 `Number` 进行转换，使用带基数的 `parseInt` 对字符串进行转换. eslint: [`radix`](http://eslint.org/docs/rules/radix) [`no-new-wrappers`](https://eslint.org/docs/rules/no-new-wrappers)

  ```javascript
  const inputValue = '4';

  // bad
  const val = new Number(inputValue);

  // bad
  const val = +inputValue;

  // bad
  const val = inputValue >> 0;

  // bad
  const val = parseInt(inputValue);

  // good
  const val = Number(inputValue);

  // good
  const val = parseInt(inputValue, 10);
  ```

<a name="coercion--comment-deviations"></a><a name="14.4"></a>

- [14.4](#coercion--comment-deviations)不管什么原因你使用了 `parseInt`，若到达了性能瓶颈，你需要使用位运算[性能原因](http://jsperf.com/coercion-vs-casting/3), 请注释说明这么做的原因.

  ```javascript
  // good
  /**
   * parseInt was the reason my code was slow.
   * Bitshifting the String to coerce it to a
   * Number made it a lot faster.
   */
  const val = inputValue >> 0;
  ```

<a name="coercion--bitwise"></a><a name="14.5"></a>

- [14.5](#coercion--bitwise)**注意:** 谨慎使用位运算. 数字使用 [64 位值](http://es5.github.io/#x4.3.19)表示, 但是位运算只返回 32 位整数 ([代码](http://es5.github.io/#x11.7)). 小于 32 位整数的位运算会导致不可预期的行为. [讨论](https://github.com/airbnb/javascript/issues/109). 最大的有符号整数是 2,147,483,647:

  ```javascript
  2147483647 >> 0; //=> 2147483647
  2147483648 >> 0; //=> -2147483648
  2147483649 >> 0; //=> -2147483647
  ```

<a name="coercion--booleans"></a><a name="14.6"></a>

- [14.6](#coercion--booleans)布尔值:

  ```javascript
  const age = 0;

  // bad
  const hasAge = new Boolean(age);

  // good
  const hasAge = Boolean(age);

  // best
  const hasAge = !!age;
  ```

**[⬆ back to top](#人工规范)**

## 十五、命名规则

<a name="naming--descriptive"></a><a name="15.1"></a>

- [15.1](#naming--descriptive)禁止单字母命名方法，命名需要有可描述性 eslint: [`id-length`](http://eslint.org/docs/rules/id-length)

  ```javascript
  // bad
  function q() {
    // ...
  }

  // good
  function query() {
    // ..
  }
  ```

<a name="naming--camelCase"></a><a name="15.2"></a>

- [15.2](#naming--camelCase)命名对象，函数和实例时使用驼峰风格. eslint: [`camelcase`](http://eslint.org/docs/rules/camelcase.html)

  ```javascript
  // bad
  const OBJEcttsssss = {};
  const this_is_my_object = {};
  function c() {}

  // good
  const thisIsMyObject = {};
  function thisIsMyFunction() {}
  ```

<a name="naming--PascalCase"></a><a name="15.3"></a>

- [15.3](#naming--PascalCase)仅当命名构造函数或类的时候使用帕斯卡风格. eslint: [`new-cap`](http://eslint.org/docs/rules/new-cap.html)

  ```javascript
  // bad
  function user(options) {
    this.name = options.name;
  }

  const bad = new user({
    name: 'nope',
  });

  // good
  class User {
    constructor(options) {
      this.name = options.name;
    }
  }

  const good = new User({
    name: 'yup',
  });
  ```

<a name="naming--leading-underscore"></a><a name="15.4"></a>

- [15.4](#naming--leading-underscore) 不要使用下划线开头或结尾. eslint: [`no-underscore-dangle`](http://eslint.org/docs/rules/no-underscore-dangle.html)

  > 原因：JavaScript 对于属性和方法并没有隐私的概念.尽管下划线开头通常意味着'private', 事实上这些属性是完全公开的，是公开 API 的一部分. 这种风格可能导致开发者错误地认为这不重要或者测试也不必要. 也就是说: 如果你想让其 “private”, 必须使其不可见.

  ```javascript
  // bad
  this.__firstName__ = 'Panda';
  this.firstName_ = 'Panda';
  this._firstName = 'Panda';

  // good
  this.firstName = 'Panda';

  // good, in environments where WeakMaps are available
  // see https://kangax.github.io/compat-table/es6/#test-WeakMap
  const firstNames = new WeakMap();
  firstNames.set(this, 'Panda');
  ```

<a name="naming--self-this"></a><a name="15.5"></a>

- [15.5](#naming--self-this) 不要保存指向 `this`的引用. 使用箭头函数或 [函数的#bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).

  ```javascript
  // bad
  function foo() {
    const self = this;
    return function () {
      console.log(self);
    };
  }

  // bad
  function foo() {
    const that = this;
    return function () {
      console.log(that);
    };
  }

  // good
  function foo() {
    return () => {
      console.log(this);
    };
  }
  ```

<a name="naming--filename-matches-export"></a><a name="15.6"></a>

- [15.6](#naming--filename-matches-export) 基本的文件名应该和默认 export 的名字刚好匹配.

  ```javascript
  // file 1 contents
  class CheckBox {
    // ...
  }
  export default CheckBox;

  // file 2 contents
  export default function fortyTwo() { return 42; }

  // file 3 contents
  export default function insideDirectory() {}

  // in some other file
  // bad
  import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
  import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
  import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

  // bad
  import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
  import forty_two from './forty_two'; // snake_case import/filename, camelCase export
  import inside_directory from './inside_directory'; // snake_case import, camelCase export
  import index from './inside_directory/index'; // requiring the index file explicitly
  import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

  // good
  import CheckBox from './CheckBox'; // PascalCase export/import/filename
  import fortyTwo from './fortyTwo'; // camelCase export/import/filename
  import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit "index"
  // ^ supports both insideDirectory.js and insideDirectory/index.js
  ```

<a name="naming--camelCase-default-export"></a><a name="15.7"></a>

- [15.7](#naming--camelCase-default-export) 当默认导出一个函数时使用驼峰风格. 文件名要和函数名相同.

  ```javascript
  function makeStyleGuide() {}

  export default makeStyleGuide;
  ```

<a name="naming--PascalCase-singleton"></a><a name="15.8"></a>

- [15.8](#naming--PascalCase-singleton) 当导出 构造函数 / 类 / 单例 / 函数库 / 对象时使用帕斯卡风格.

  ```javascript
  const AirbnbStyleGuide = {
    es6: {},
  };

  export default AirbnbStyleGuide;
  ```

<a name="naming--Acronyms-and-Initialisms"></a><a name="15.9"></a>

- [15.9](#naming--Acronyms-and-Initialisms) 缩略词应全部大写或小写.

  > 原因：名字是用来阅读的，不能让步给计算机算法.

  ```javascript
  // bad
  import SmsContainer from './containers/SmsContainer';

  // bad
  const HttpRequests = [
    // ...
  ];

  // good
  import SMSContainer from './containers/SMSContainer';

  // good
  const HTTPRequests = [
    // ...
  ];

  // best
  import TextMessageContainer from './containers/TextMessageContainer';

  // best
  const Requests = [
    // ...
  ];
  ```

  <a name="naming--uppercase"></a><a name="15.10"></a>

- [15.10](#naming--uppercase) 可以在以下情况把一个常量全部大写(1) 被导出, (2) `const`声明的 (不能被重新赋值), (3) 开发者 r 认为该变量(内部嵌套的属性)不会改变.

  > 原因? 这对于开发者不确定变量是否会改变的情形下的额外的辅助工具. UPPERCASE_VARIABLES 能让开发者明确该变量(和它的属性)无法改变.

  - 所有用`const` 声明的变量呢? - 没必要，所以一个文件内的常量没必要用大写. 然而在导出常量的时候应该使用大写.
  - 导出的对象呢? - 只对导出对象的顶层使用大写(如 `EXPORTED_OBJECT.key`) 保证嵌套的属性都不会改变.

  ```javascript
  // bad
  const PRIVATE_VARIABLE =
    'should not be unnecessarily uppercased within a file';

  // bad
  export const THING_TO_BE_CHANGED = 'should obviously not be uppercased';

  // bad
  export let REASSIGNABLE_VARIABLE = 'do not use let with uppercase variables';

  // ---

  // allowed but does not supply semantic value
  export const apiKey = 'SOMEKEY';

  // better in most cases
  export const API_KEY = 'SOMEKEY';

  // ---

  // bad - unnecessarily uppercases key while adding no semantic value
  export const MAPPING = {
    KEY: 'value',
  };

  // good
  export const MAPPING = {
    key: 'value',
  };
  ```

**[⬆ back to top](#人工规范)**

## 十六、存取器

<a name="accessors--not-required"></a><a name="16.1"></a>

- [16.1](#accessors--not-required) 属性的存取器不是必需的.

<a name="accessors--no-getters-setters"></a><a name="16.2"></a>

- [16.2](#accessors--no-getters-setters) 不要使用 JavaScript getters/setters 因为可能引起不可预期的副作用,很难测试、维护和理解. 相反，如果要使用存取器函数，使用 `getVal()` 和 `setVal('hello')`.

  ```javascript
  // bad
  class Dragon {
    get age() {
      // ...
    }

    set age(value) {
      // ...
    }
  }

  // good
  class Dragon {
    getAge() {
      // ...
    }

    setAge(value) {
      // ...
    }
  }
  ```

<a name="accessors--boolean-prefix"></a><a name="16.3"></a>

- [16.3](#accessors--boolean-prefix)如果属性/方法是 `boolean`, 使用 `isVal()` 或 `hasVal()`方法.

  ```javascript
  // bad
  if (!dragon.age()) {
    return false;
  }

  // good
  if (!dragon.hasAge()) {
    return false;
  }
  ```

<a name="accessors--consistent"></a><a name="16.4"></a>

- [16.4](#accessors--consistent) 也可以创建 `get()` 和 `set()` 函数, 但要保持一致.

  ```javascript
  class Jedi {
    constructor(options = {}) {
      const lightsaber = options.lightsaber || 'blue';
      this.set('lightsaber', lightsaber);
    }

    set(key, val) {
      this[key] = val;
    }

    get(key) {
      return this[key];
    }
  }
  ```

**[⬆ back to top](#人工规范)**

## 十七、事件

<a name="events--hash"></a><a name="17.1"></a>

- [17.1](#events--hash) 当将数据和事件绑定时 (不论是 DOM 事件还是其他像 Backbone 一类的事件), 传递对象字面量(也叫摘要值)而不是原始值. 这会允许接下来的修改者不用查找和更新事件的每一个处理器就可以给事件添加更多的数据，不要使用下边的:

  ```javascript
  // bad
  $(this).trigger('listingUpdated', listing.id);

  ...

  $(this).on('listingUpdated', (e, listingId) => {
    // do something with listingId
  });
  ```

  建议:

  ```javascript
  // good
  $(this).trigger('listingUpdated', { listingId: listing.id });

  ...

  $(this).on('listingUpdated', (e, data) => {
    // do something with data.listingId
  });
  ```

**[⬆ back to top](#人工规范)**

## 十八、异常

对已知的异常处理逻辑需使用 try catch，并在 catch 中做异常处理，通常采用弹 Notification 或者 Message 告知用户

**[⬆ back to top](#人工规范)**

## 十九、标准库

[标准库](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects)包含功能有问题但由于遗留原因保留下来的功能.

<a name="standard-library--isnan"></a><a name="19.1"></a>

- [19.1](#standard-library--isnan) 使用 `Number.isNaN` 代替全局 `isNaN`方法.
  eslint: [`no-restricted-globals`](https://eslint.org/docs/rules/no-restricted-globals)

  > 原因: 全局的 `isNaN` 方法会将非数字转换为数字, 任何被转换为 NaN 的东西都会返回 true.
  > 若该行为被允许，则要使其明显.

  ```javascript
  // bad
  isNaN('1.2'); // false
  isNaN('1.2.3'); // true

  // good
  Number.isNaN('1.2.3'); // false
  Number.isNaN(Number('1.2.3')); // true
  ```

<a name="standard-library--isfinite"></a><a name="19.2"></a>

- [19.2](#standard-library--isfinite) 使用 `Number.isFinite` 代替全局 `isFinite`.
  eslint: [`no-restricted-globals`](https://eslint.org/docs/rules/no-restricted-globals)

  > 原因: 全局 `isFinite` 会把非数字转换为数字, 任何被转换为有限大的数字都会返回 true.
  > 若该行为被允许，则要使其明显.

  ```javascript
  // bad
  isFinite('2e3'); // true

  // good
  Number.isFinite('2e3'); // false
  Number.isFinite(parseInt('2e3', 10)); // true
  ```

**[⬆ back to top](#人工规范)**

## 二十、性能

- [On Layout & Web Performance](http://www.kellegous.com/j/2013/01/26/layout-performance/)
- [String vs Array Concat](http://jsperf.com/string-vs-array-concat/2)
- [Try/Catch Cost In a Loop](http://jsperf.com/try-catch-in-loop-cost)
- [Bang Function](http://jsperf.com/bang-function)
- [jQuery Find vs Context, Selector](http://jsperf.com/jquery-find-vs-context-sel/13)
- [innerHTML vs textContent for script text](http://jsperf.com/innerhtml-vs-textcontent-for-script-text)
- [Long String Concatenation](http://jsperf.com/ya-string-concat)
- [Are Javascript functions like `map()`, `reduce()`, and `filter()` optimized for traversing arrays?](https://www.quora.com/JavaScript-programming-language-Are-Javascript-functions-like-map-reduce-and-filter-already-optimized-for-traversing-array/answer/Quildreen-Motta)
- Loading...

**[⬆ back to top](#人工规范)**

## 二十一、资源

**学习 ES6**

- [Latest ECMA spec](https://tc39.github.io/ecma262/)
- [ExploringJS](http://exploringjs.com/)
- [ES6 Compatibility Table](https://kangax.github.io/compat-table/es6/)
- [Comprehensive Overview of ES6 Features](http://es6-features.org/)

**阅读**

- [Standard ECMA-262](http://www.ecma-international.org/ecma-262/6.0/index.html)

**工具**

- 代码风格校验
  - [ESlint](http://eslint.org/) - [Airbnb Style .eslintrc](https://github.com/airbnb/javascript/blob/master/linters/.eslintrc)
  - [JSHint](http://jshint.com/) - [Airbnb Style .jshintrc](https://github.com/airbnb/javascript/blob/master/linters/.jshintrc)
  - Neutrino preset - [@neutrinojs/airbnb](https://neutrinojs.org/packages/airbnb/)

**其他编码规范指南**

- [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
- [jQuery Core Style Guidelines](http://contribute.jquery.org/style-guide/js/)
- [Principles of Writing Consistent, Idiomatic JavaScript](https://github.com/rwaldron/idiomatic.js)
- [StandardJS](https://standardjs.com)

**其他风格**

- [Naming this in nested functions](https://gist.github.com/cjohansen/4135065) - Christian Johansen
- [Conditional Callbacks](https://github.com/airbnb/javascript/issues/52) - Ross Allen
- [Popular JavaScript Coding Conventions on Github](http://sideeffect.kr/popularconvention/#javascript) - JeongHoon Byun
- [Multiple var statements in JavaScript, not superfluous](http://benalman.com/news/2012/05/multiple-var-statements-javascript/) - Ben Alman

**更深的阅读**

- [Understanding JavaScript Closures](http://javascriptweblog.wordpress.com/2010/10/25/understanding-javascript-closures/) - Angus Croll
- [Basic JavaScript for the impatient programmer](http://www.2ality.com/2013/06/basic-javascript.html) - Dr. Axel Rauschmayer
- [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Zack Bloom & Adam Schwartz
- [ES6 Features](https://github.com/lukehoban/es6features) - Luke Hoban
- [Frontend Guidelines](https://github.com/bendc/frontend-guidelines) - Benjamin De Cock

**书籍**

- [JavaScript: The Good Parts](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742) - Douglas Crockford
- [JavaScript Patterns](http://www.amazon.com/JavaScript-Patterns-Stoyan-Stefanov/dp/0596806752) - Stoyan Stefanov
- [Pro JavaScript Design Patterns](http://www.amazon.com/JavaScript-Design-Patterns-Recipes-Problem-Solution/dp/159059908X) - Ross Harmes and Dustin Diaz
- [High Performance Web Sites: Essential Knowledge for Front-End Engineers](http://www.amazon.com/High-Performance-Web-Sites-Essential/dp/0596529309) - Steve Souders
- [Maintainable JavaScript](http://www.amazon.com/Maintainable-JavaScript-Nicholas-C-Zakas/dp/1449327680) - Nicholas C. Zakas
- [JavaScript Web Applications](http://www.amazon.com/JavaScript-Web-Applications-Alex-MacCaw/dp/144930351X) - Alex MacCaw
- [Pro JavaScript Techniques](http://www.amazon.com/Pro-JavaScript-Techniques-John-Resig/dp/1590597273) - John Resig
- [Smashing Node.js: JavaScript Everywhere](http://www.amazon.com/Smashing-Node-js-JavaScript-Everywhere-Magazine/dp/1119962595) - Guillermo Rauch
- [Secrets of the JavaScript Ninja](http://www.amazon.com/Secrets-JavaScript-Ninja-John-Resig/dp/193398869X) - John Resig and Bear Bibeault
- [Human JavaScript](http://humanjavascript.com/) - Henrik Joreteg
- [Superhero.js](http://superherojs.com/) - Kim Joar Bekkelund, Mads Mobæk, & Olav Bjorkoy
- [JSBooks](http://jsbooks.revolunet.com/) - Julien Bouquillon
- [Third Party JavaScript](https://www.manning.com/books/third-party-javascript) - Ben Vinegar and Anton Kovalyov
- [Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript](http://amzn.com/0321812182) - David Herman
- [Eloquent JavaScript](http://eloquentjavascript.net/) - Marijn Haverbeke
- [You Don't Know JS: ES6 & Beyond](http://shop.oreilly.com/product/0636920033769.do) - Kyle Simpson

**博客**

- [JavaScript Weekly](http://javascriptweekly.com/)
- [JavaScript, JavaScript...](http://javascriptweblog.wordpress.com/)
- [Bocoup Weblog](https://bocoup.com/weblog)
- [Adequately Good](http://www.adequatelygood.com/)
- [NCZOnline](https://www.nczonline.net/)
- [Perfection Kills](http://perfectionkills.com/)
- [Ben Alman](http://benalman.com/)
- [Dmitry Baranovskiy](http://dmitry.baranovskiy.com/)
- [nettuts](http://code.tutsplus.com/?s=javascript)

**播客**

- [JavaScript Air](https://javascriptair.com/)
- [JavaScript Jabber](https://devchat.tv/js-jabber/)

**[⬆ back to top](#人工规范)**
