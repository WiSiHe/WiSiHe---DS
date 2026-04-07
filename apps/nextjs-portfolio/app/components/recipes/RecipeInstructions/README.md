# Dynamic Ingredient References in Recipe Instructions

This feature allows you to reference ingredients in your recipe instructions using a special syntax. When the serving size changes, the ingredient amounts in the instructions will automatically update.

## How to Use

In your Sanity Studio, when writing recipe instructions, you can reference ingredients using double curly braces:

### Basic Syntax

```
{{ingredient_name}}
```

### Examples

1. **Simple reference**: `Add {{eggs}} to the mixture`
   - If you have "3 large eggs" in your ingredients, this will show "3 large eggs"
   - If you change servings from 4 to 8, it will show "6 large eggs"

2. **With ingredient name**: `Mix {{flour}} with {{milk}}`
   - This will replace with the actual amounts from your ingredients list
   - Shows "2 cups flour" and "1 cup milk" (includes ingredient names)

3. **Smart ingredient names**: The system intelligently handles ingredient names
   - For measurement units (grams, liters, dl, cups, tbsp, etc.): adds ingredient name
   - For descriptive units (large eggs, medium apples, etc.): shows only the unit

4. **Case insensitive**: `{{Flour}}` or `{{flour}}` will both work

## How It Works

1. The system searches for ingredient names in your ingredient categories
2. When it finds a match, it calculates the adjusted amount based on:
   - Original servings vs current servings
   - Whether the ingredient is discrete (like eggs)
   - Current measurement mode (regular or grams)
3. The reference is replaced with the calculated amount and unit
4. **Ingredient references appear in bold** on the frontend for easy identification

## Example Recipe Instruction

```
1. Preheat oven to 350°F (175°C)
2. In a large bowl, whisk together {{eggs}} and {{sugar}} until light and fluffy
3. Add {{milk}} and {{vanilla}} and mix well
4. Gradually add {{flour}} and {{baking_powder}}, mixing until just combined
5. Pour into prepared pan and bake for 25-30 minutes
```

If your original recipe serves 4 people and you change it to serve 8, the instructions will automatically show:

- "6 large eggs" instead of "3 large eggs" (descriptive unit)
- "2 cups sugar" instead of "1 cup sugar" (measurement unit + ingredient name)
- "2 cups flour" instead of "1 cup flour" (measurement unit + ingredient name)
- "2 medium apples" instead of "1 medium apple" (descriptive unit)

## Notes

- Ingredient names must match exactly (case-insensitive)
- If an ingredient isn't found, the original text will be preserved
- The system uses the primary measurement units (no alternative measurements)
- Discrete items like eggs will be rounded appropriately
- **Ingredient references are automatically displayed in bold** for better readability
