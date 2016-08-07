# Modeler

Data modeling and validation tool.

```js
import Modeler from 'modeler';

class ValueModule extends Module {
  static properties = Modeler({
    key: Modeler.Text.required,
    value: Modeler.Text.dynamic.required,
    size: Modeler.Select('full', 'half', 'quarter').required
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
model.blank() // => { name: '', age: '' }
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
```

### any

A field can allow any type, or allow for one of a set of types.

```js
Modeler.any;                                    // Anything!
Modeler.any.of(Modeler.Text, Modeler.Number);   // Text or number
Modeler.any.of([Modeler.Text, Modeler.Number]); // Can also be an array
```
