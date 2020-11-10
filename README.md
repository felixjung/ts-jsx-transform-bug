# TypeScript 4.1 beta JSX Transform Bug

The TypeScript 4.1 beta does not handle the children as function pattern
correctly when transpiling JSX.

This example code does not work with TypeScript 4.1 beta.

```ts
// src/index.tsx
import * as React from "react";

export interface CodeBlockProps {
  children?: string;
  // language?: Language
  className?: string;
}

type MyComponentProps = {
  name: string;
  children: ({ name }: { name: string }) => JSX.Element;
};

const MyComponent: React.FunctionComponent<MyComponentProps> = ({
  name,
  children
}) => <p>Hello, {children({ name })}</p>;

export const CodeBlock: React.FunctionComponent<CodeBlockProps> = () => (
  <MyComponent name="Friend">
    {({ name }) => {
      console.log(name);
      return <span>{name}</span>;
    }}
  </MyComponent>
);
```

For comparison, the following JS code is passed to Babel.

```js
const MyComponent = ({ name, children }) => <p>Hello, {children({ name })}</p>;

export const CodeBlock = () => (
  <MyComponent name="Meister">
    {({ name }) => {
      console.log(name);
      return <span>{name}</span>;
    }}
  </MyComponent>
);
```

## Output Comparison

The below sections show compilation output from Babel and TypeScript 4.1 with
different configurations.

### Output from Babel

```js
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

const MyComponent = ({ name, children }) =>
  /*#__PURE__*/ _jsxs("p", {
    children: [
      "Hello, ",
      children({
        name
      })
    ]
  });

export const CodeBlock = () =>
  /*#__PURE__*/ _jsx(MyComponent, {
    name: "Meister",
    children: ({ name }) => {
      console.log(name);
      return /*#__PURE__*/ _jsx("span", {
        children: name
      });
    }
  });
```

### Output from TypeScript 4.1 with compiler option `"jsx": "react"`

```js
import * as React from "react";
const MyComponent = ({ name, children }) =>
  React.createElement("p", null, "Hello, ", children({ name }));
export const CodeBlock = () =>
  React.createElement(MyComponent, { name: "Friend" }, ({ name }) => {
    console.log(name);
    return React.createElement("span", null, name);
  });
//# sourceMappingURL=index.js.map
```

### Output from TypeScript 4.1 with compiler option `"jsx": "react-jsx"`

The output shows several problems.

1. Children are now an array. This breaks the function as child pattern.
   `MyComponent` will cause a runtime error when trying to call `children()`.
2. The `children` prop is not passed to the `span`'s `_jsx()` call and therefore
   won't be rendered.

```js
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const MyComponent = ({ name, children }) => _jsxs("p", {}, void 0);
export const CodeBlock = () =>
  _jsxs(
    MyComponent,
    Object.assign(
      { name: "Friend" },
      {
        children: [
          ({ name }) => {
            console.log(name);
            return _jsx("span", {}, void 0);
          }
        ]
      }
    ),
    void 0
  );
//# sourceMappingURL=index.js.map
```

## Reproducing Results

Use the following commands to reproduce the build output.

1. `npm run build:babel` for babel output.
2. `npm run build:ts:react` for TypeScript output with `"jsx": "react"`.
3. `npm run build:ts:react-jsx` for TypeScript output with `"jsx": "react-jsx"`
   (new transform).
