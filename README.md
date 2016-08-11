# Modeler

Data modeling and validation tool.

```js
import Modeler, { Types } from 'modeler';

class ValueModule extends Module {
  static properties = Modeler({
    key: Types.Text.required,
    value: Types.Text.dynamic.required,
    size: Types.Option('full', 'half', 'quarter').required
  })
}

class PieChartModule extends Module {
  static properties = Modeler({
    items: Types.Collection({
      key: Types.Text.required,
      size: Types.Number.between(0, 1).required
    }).atLeast(1)
  })
}
```

## Models

Create a model with the `Modeler` function, then pass in fields in an object.

```js
const model = Modeler({
  name: Types.Text.required,
  age: Types.Number.required
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
Types.Field.dynamic; // Make a field's value filterable
Types.Field.required; // Make a field required
Types.Field.default('default'); // Set a field's default value
Types.Field.filter(fn); // Convert value with a function
```

### Text

A text field is any string.

```js
Types.Text;
Types.Text.atLeast(5);     // String must have at least 5 characters
Types.Text.atMost(30);     // String must have at most 30 characters
Types.Text.between(5, 30); // String must have 5&ndash;30 characters
```

### Number

A number field is any number, or a number stored as a string.

```js
Types.Number;
Types.Number.between(0, 1); // Limit the range of numbers
Types.Number.atLeast(0);    // Floor for number
Types.Number.atMost(1);     // Ceiling for number
Types.Number.allowStrings;  // Number can be a string
```

### Option

An option field is a single choice among multiple values. Can be stored as any type.

```js
Types.Option('one', 'two', 'three');
Types.Option(['one', 'two', 'three']); // Can also be passed as an array
```

### Boolean

A boolean is either `true` or `false`.

```js
Types.Boolean;
Types.Boolean.default(true); // Default is false unless specified
Types.Boolean.allowStrings;  // Value can be string "true" or "false"
```

### Array

A series is a series of items.

```js
Types.Array;                  // Items can be any type
Types.Array.of(Types.Text);   // Items must all be one type
Types.Array.atLeast(1);       // Array must have at least 1 item
Types.Array.atMost(10);       // Array must have 10 or fewer items
Types.Array.between(1, 10);   // Array must have 1&ndash;10 items
```

### Object

An object is... an object.

```js
Types.Object;
Types.Object.keys(Types.Text);     // Keys must be a certain type
Types.Object.values(Types.Series); // Values must be a certain type
Types.Object.shape({                 // Object must have a precise shape
  name: Types.Text.required,
  age: Types.Number.between(1, 100).required
})
```

### Collection

A collection is an array of objects. It's like a model *inside* a model!

```js
Types.Collection({
  title: Types.Text.required,
  pct: Types.Number.between(0, 100).required
});
Types.Collection({}).atLeast(1);     // Collection must have at least 1 item
Types.Collection({}).atMost(10);     // Collection must have 10 or fewer items
Types.Collection({}).between(1, 10); // Collection must have 1&ndash;10 items
```

### any

A field can allow any type, or allow for one of a set of types.

```js
Types.any;                                    // Anything!
Types.any.of(Types.Text, Types.Number);   // Text or number
Types.any.of([Types.Text, Types.Number]); // Can also be an array
```

### Aliases

If you use a complex type definition in multiple places, you can create an alias.

```js
// Type that stores a raw value and references to filtering functions
Modeler.alias('DynamicField', Types.Object.shape({
  value: Types.Text.required,
  filters: Types.Array.of(Types.Text).required
}));

// Now reference the type like you would any other
Modeler({
  key: Types.Text.required,
  value: Types.DynamicField.required
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
