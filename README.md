# Modeler

Data modeling and validation tool.

```js
import Modeler from 'modeler';

class ValueModule extends GeoViewModule {
  static properties = Modeler({
    key: Modeler.Text.required,
    value: Modeler.Text.dynamic.required,
    size: Modeler.Select('full', 'half', 'quarter').required
  })
}

class PieChartModule extends GeoViewModule {
  static properties = Modeler({
    items: Modeler.Collection({
      key: Modeler.Text.required,
      size: Modeler.Number.between(0, 1).required
    }).atLeast(1)
  })
}
```

## API

### Fields

#### Common Modifiers

These settings can be applied to any field type.

```js
Modeler.Field.dynamic; // Make a field's value filterable
Modeler.Field.required; // Make a field required
Modeler.Field.default('default'); // Set a field's default value
Modeler.Field.filter(fn); // Convert value with a function
```

#### Text

A text field is any string.

```js
Modeler.Text;
```

#### Number

A number field is any number, or a number stored as a string.

```js
Modeler.Number;
Modeler.Number.between(0, 1);
```

#### Option

An option field is a single choice among multiple values. Can be stored as any type.

```js
Modeler.Option('one', 'two', 'three');
Modeler.Option(['one', 'two', 'three']); // Can also be passed as an array
```

#### Flag

A flag is a yes/no choice, stored as a boolean.

```js
Modeler.Flag;
Modeler.Flag.default(true); // Default is false unless specified
```

#### Date

A date is a Unix Time number.

```js
Modeler.Date;
// Formatted with dateformat: https://www.npmjs.com/package/dateformat
// Can also be formatted manually with a filter
Modeler.Date.format('mmmm dS, yyyy');
```

#### Collection

A collection is a variable-length group of the same thing, stored as as array.

A collection can be for a simple value, like a collection of numbers.

```js
Modeler.Collection(Modeler.Number);
Modeler.Collection().atLeast(1); // Define a minimum number of items
```

A collection can also be for a complex object.

```js
Modeler.Collection({
  title: Modeler.Text.required,
  pct: Modeler.Number.between(0, 100).required
});
```
