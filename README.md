# Modeler

Data modeling and validation tool.

```js
import Modeler from 'modeler';

class ValueModule extends Module {
  static properties = Modeler({
    key: Modeler.Text.required,
    value: Modeler.Text.dynamic.required,
    size: Modeler.Option('full', 'half', 'quarter').required
  })
}

class PieChartModule extends Module {
  static properties = Modeler({
    items: Modeler.Collection({
      key: Modeler.Text.required,
      size: Modeler.Number.between(0, 1).required
    }).atLeast(1)
  })
}
```

## Models

Create a model with the `Modeler` function, then pass in fields in an object.

```js
const model = Modeler({
  name: Modeler.Text.required,
  age: Modeler.Number.required
});
```

With this model, you can validate that an object fits the model's requirements.

```js
// Valid, returns true
model.validate({
  name: 'Brian Wilson',
  age: 22
});

// Invalid, returns false
model.validate({
  name: 29038294,
  age: 22
});
```

You can also generate a blank object that fits the model's shape.

```js
model.blank(); // => { name: '', age: '' }
```

## Fields

### Common Modifiers

These settings can be applied to any field type.

```js
Modeler.Field.dynamic; // Make a field's value filterable
Modeler.Field.required; // Make a field required
Modeler.Field.default('default'); // Set a field's default value
Modeler.Field.filter(fn); // Convert value with a function
```

### Text

A text field is any string.

```js
Modeler.Text;
Modeler.Text.atLeast(5);     // String must have at least 5 characters
Modeler.Text.atMost(30);     // String must have at most 30 characters
Modeler.Text.between(5, 30); // String must have 5&ndash;30 characters
```

### Number

A number field is any number, or a number stored as a string.

```js
Modeler.Number;
Modeler.Number.between(0, 1); // Limit the range of numbers
Modeler.Number.atLeast(0);    // Floor for number
Modeler.Number.atMost(1);     // Ceiling for number
Modeler.Number.allowStrings;  // Number can be a string
```

### Option

An option field is a single choice among multiple values. Can be stored as any type.

```js
Modeler.Option('one', 'two', 'three');
Modeler.Option(['one', 'two', 'three']); // Can also be passed as an array
```

### Flag

A flag is a yes/no choice, stored as a boolean.

```js
Modeler.Flag;
Modeler.Flag.default(true); // Default is false unless specified
Modeler.Flag.allowStrings;  // Value can be string "true" or "false"
```

### Series

A series is an array of items.

```js
Modeler.Series;                  // Items can be any type
Modeler.Series.of(Modeler.Text); // Items must all be one type
Modeler.Series.atLeast(1);       // Array must have at least 1 item
Modeler.Series.atMost(10);       // Array must have 10 or fewer items
Modeler.Series.between(1, 10);   // Array must have 1&ndash;10 items
```

### Object

An object is... an object.

```js
Modeler.Object;
Modeler.Object.keys(Modeler.Text);     // Keys must be a certain type
Modeler.Object.values(Modeler.Series); // Values must be a certain type
Modeler.Object.shape({                 // Object must have a precise shape
  name: Modeler.Text.required,
  age: Modeler.Number.between(1, 100).required
})
```

### Collection

A collection is an array of objects. It's like a model *inside* a model!

```js
Modeler.Collection({
  title: Modeler.Text.required,
  pct: Modeler.Number.between(0, 100).required
});
Modeler.Collection({}).atLeast(1);     // Collection must have at least 1 item
Modeler.Collection({}).atMost(10);     // Collection must have 10 or fewer items
Modeler.Collection({}).between(1, 10); // Collection must have 1&ndash;10 items
```

### any

A field can allow any type, or allow for one of a set of types.

```js
Modeler.any;                                    // Anything!
Modeler.any.of(Modeler.Text, Modeler.Number);   // Text or number
Modeler.any.of([Modeler.Text, Modeler.Number]); // Can also be an array
```

### Aliases

If you use a complex type definition in multiple places, you can create an alias.

```js
// Type that stores a raw value and references to filtering functions
Modeler.alias('DynamicField', Modeler.Object.shape({
  value: Modeler.Text.required,
  filters: Modeler.Series.of(Modeler.Text).required
}));

// Now reference the type like you would any other
Modeler({
  key: Modeler.Text.required,
  value: Modeler.DynamicField.required
});
```

## Custom Types

Create a custom field type by calling `Modeler.type()`, passing in a name and these settings:

- `name` (String): string representation of type.
- `params` (Object): overrides to the default parameters of a type, or new parameters. All types have these three parameters by default:
  - `default` (Any): default value for this field.
  - `required` (Boolean): if this field is required.
  - `dynamic` (Boolean): if this field id dynamic (filterable).
- `validators` (Array): initial validation checks to run on values in this field. These are usually the most basic checks needed.
- `methods` (Object): chainable methods usable by this type.

```js
const Modeler = require('modeler');

Modeler.type('Function', {
  name: 'function',
  params: {
    default: () => {}
  },
  validators: [
    (value) => typeof value === 'function'
  ],
  methods: []
});

Modeler({
  name: Types.Text.required,
  fn: Types.Function.required
});
```
