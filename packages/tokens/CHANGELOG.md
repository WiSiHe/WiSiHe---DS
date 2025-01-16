# @tine/tokens

## 1.11.3

## 1.11.2

## 1.11.1

## 1.11.0

### Minor Changes

- 1de84a2: feat: new text color for regular text, and subtle version.

  - ink-default-inverted —> ink-brand-inverted
  - ink-default —> ink-brand-default
  - ink-subtle —> ink-brand-subtle
  - ink-default (**new**)
  - ink-subtle (**new**)

### Patch Changes

- 1ff7213: Update Figma color tokens

## 1.10.3

## 1.10.2

## 1.10.1

## 1.10.0

## 1.9.2

## 1.9.1

### Patch Changes

- ced79a5: Added Isdalen theme

## 1.9.0

## 1.8.1

## 1.8.0

## 1.7.1

### Patch Changes

- b7a19b5: Update Figma color tokens

## 1.7.0

## 1.6.1

## 1.6.0

## 1.5.1

## 1.5.0

### Minor Changes

- 7dc65be: Updated packages

### Patch Changes

- e35102e: Update Figma color tokens
- a94a797: Update Figma color tokens

## 1.4.0

## 1.3.2

## 1.3.1

## 1.3.0

### Minor Changes

- 5ad0d28: Added script and workflow to sync colors and spacing from figma to code

### Patch Changes

- cee1f95: Update Figma color tokens
- 7f8e687: Export tokens in package.json based on list of brands
- bbcd089: Added support for fjordland sub-brands in figma api sync

## 1.2.1

## 1.2.0

### Patch Changes

- 4ad9622: Added leverant theme

## 1.1.0

### Patch Changes

- 4cbd023: unified button and input height

## 1.0.36

## 1.0.35

## 1.0.34

## 1.0.33

## 1.0.32

## 1.0.31

## 1.0.30

## 1.0.29

## 1.0.28

## 1.0.27

## 1.0.26

## 1.0.25

## 1.0.24

## 1.0.23

## 1.0.22

## 1.0.21

## 1.0.20

## 1.0.19

## 1.0.18

## 1.0.17

## 1.0.16

## 1.0.15

## 1.0.14

## 1.0.13

## 1.0.12

## 1.0.11

## 1.0.10

## 1.0.9

## 1.0.8

## 1.0.7

## 1.0.6

## 1.0.5

## 1.0.4

## 1.0.3

## 1.0.2

## 1.0.1

### Patch Changes

- aad116b: Added Switch component

## 1.0.0

### Major Changes

- ad7b72c: Updated tokens structure to reflect the token structure from Figma, updated tailwind config to reflect the new tokens and updated the UI components to use the new tokens.

  Added fallback token structure, using global and base tokens as fallbacks for the design tokens.

  New token import methods:

  ```css
  // Old method of importing css tokens
  @import '@tine/designsystem-tokens/dist/css/tine/variables.css';
  @import '@tine/designsystem-tokens/dist/css/diplom-is/variables.css';
  @import '@tine/designsystem-tokens/dist/css/fjordland-base/variables.css';
  @import '@tine/designsystem-tokens/dist/css/fjordland/variables.css';
  @import '@tine/designsystem-tokens/dist/css/brelett/variables.css';
  @import '@tine/designsystem-tokens/dist/css/kos/variables.css';
  @import '@tine/designsystem-tokens/dist/css/safari/variables.css';
  @import '@tine/designsystem-tokens/dist/css/yoplait/variables.css';

  // New method of importing css tokens
  @import '@tine/designsystem-tokens/tine/css';
  @import '@tine/designsystem-tokens/diplom-is/css';
  @import '@tine/designsystem-tokens/fjordland-base/css';
  @import '@tine/designsystem-tokens/fjordland/css';
  @import '@tine/designsystem-tokens/brelett/css';
  @import '@tine/designsystem-tokens/kos/css';
  @import '@tine/designsystem-tokens/safari/css';
  @import '@tine/designsystem-tokens/yoplait/css';

  // More supported formats
  @import '@tine/designsystem-tokens/tine/css'; // css
  @import '@tine/designsystem-tokens/tine/scss'; // scss
  @import '@tine/designsystem-tokens/tine/json'; // json
  @import '@tine/designsystem-tokens/tine/scss'; // js
  ```

  New button icon size prop:

  ```jsx
  <Button size="icon" icon={<IconEdit />} />
  ```

  New Checkbox variant prop:

  ```jsx
  // Old
  <Checkbox inverted />
  // New
  <Checkbox variant="inverted" />
  ```

## 0.3.114

## 0.3.113

## 0.3.112

## 0.3.111

## 0.3.110

## 0.3.109

## 0.3.108

## 0.3.107

## 0.3.106

## 0.3.105

## 0.3.104

## 0.3.103

## 0.3.102

## 0.3.101

## 0.3.100

## 0.3.99

## 0.3.98

## 0.3.97

## 0.3.96

## 0.3.95

## 0.3.94

## 0.3.93

## 0.3.92

## 0.3.91

## 0.3.90

## 0.3.89

## 0.3.88

## 0.3.87

## 0.3.86

## 0.3.85

## 0.3.84

## 0.3.83

## 0.3.82

## 0.3.81

## 0.3.80

## 0.3.79

## 0.3.78

## 0.3.77

### Patch Changes

- a75452c: Generating scss

## 0.3.76

## 0.3.75

## 0.3.74

## 0.3.73

## 0.3.72

## 0.3.71

## 0.3.70

## 0.3.69

### Patch Changes

- 491ec48: Adjusted radius tokens

## 0.3.68

## 0.3.67

### Patch Changes

- cd48bac: Updated packages

## 0.3.66

## 0.3.65

## 0.3.64

## 0.3.63

## 0.3.62

## 0.3.61

## 0.3.60

## 0.3.59

## 0.3.58

## 0.3.57

## 0.3.56

## 0.3.55

### Patch Changes

- 4ac2fca: Added brand class for specificity

## 0.3.54

### Patch Changes

- 3f65e57: Updated tokens for Fjordland and respective token use in button component

## 0.3.53

## 0.3.52

## 0.3.51

## 0.3.50

## 0.3.49

## 0.3.48

## 0.3.47

## 0.3.46

## 0.3.45

## 0.3.44

## 0.3.43

## 0.3.42

## 0.3.41

## 0.3.40

## 0.3.39

## 0.3.38

## 0.3.37

## 0.3.36

## 0.3.35

## 0.3.34

## 0.3.33

## 0.3.32

## 0.3.31

## 0.3.30

## 0.3.29

## 0.3.28

## 0.3.27

### Patch Changes

- adab072: New tokens, fixes to colors in UI and new TW config variables

## 0.3.26

### Patch Changes

- fd737e2: Using tailwind prefix

## 0.3.25

## 0.3.24

## 0.3.23

## 0.3.22

## 0.3.21

## 0.3.20

## 0.3.19

## 0.3.18

## 0.3.17

## 0.3.16

## 0.3.15

## 0.3.14

## 0.3.13

### Patch Changes

- 234ad05: Updated readme files

## 0.3.12

## 0.3.11

### Patch Changes

- a4dc98c: Added more brand tokens, added those tokens to Tailwind config, and updated buttons with the new tokens and styles

## 0.3.10

## 0.3.9

## 0.3.8

## 0.3.7

## 0.3.6

## 0.3.5

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

## 0.3.0

### Minor Changes

- f4b9c62: Linking all packages

## 0.2.48

### Patch Changes

- ab675f2: package renaming

## 0.2.35

### Patch Changes

- 45de724: new hover, fixed icons

## 0.2.34

### Patch Changes

- 45de724: new hover, fixed icons

## 0.2.33

### Patch Changes

- Buttons and icons

## 0.2.9

### Patch Changes

- new alert colors

## 0.0.8

### Patch Changes

- More button types and variables

## 0.0.7

### Patch Changes

- New variables

## 0.0.6

### Patch Changes

- specificity

## 0.0.5

### Patch Changes

- consistens names
- consistens names

## 0.0.4

### Patch Changes

- classes

## 0.0.3

### Patch Changes

- Version bumb

## 0.0.2

### Patch Changes

- e697cd7: variables in Tailwind config
