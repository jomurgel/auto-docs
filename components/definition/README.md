# Custom Component: Definition
Creates a `definition` element.

## Usage
```jsx
import Definition from '../../components/definition';

<Definition term="class-heartbeat.php">
  A class which adds an optional heartbeat modification for some brands to shorten the frequency of
    reporting. Enabled via Cheezcap option in the brand's "Theme Options" page.
</Definition>
```

## Props
| prop     | type   | required | description                     |
|----------|--------|----------|---------------------------------|
| term     | string | yes      | `dt` element. Term name.        |
| children | Node   | yes      | `dd` element. Term description. |