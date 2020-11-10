const MyComponent = ({
  name,
  children
}) => <p>Hello, {children({ name })}</p>;

export const CodeBlock = () => (
  <MyComponent name="Meister">
    {({ name }) => {
      console.log(name);
      return <span>{name}</span>;
    }}
  </MyComponent>
);

