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
