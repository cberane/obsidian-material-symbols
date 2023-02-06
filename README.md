# Material Symbols Plugin

This is a simple plugin for Obsidian to add Google's material symbols outlined.

This plugin adds 2 commands to easily add symbols to the current document.

## Usage

1. Hit `Ctrl + P` and search for `symbol`.  
   You can find 2 options to add the icons:
	1. `Add Symbol` adds `<span class="mso"></span>`
	2. `Add Symbol (class single-quoted)` to add `<span class='mso'></span>`
	   as it could be needed in nested elements.
2. After inserting the icon html, the cursor will be set into the tag.
3. Add the icon name as expected from
   [Google Material Symbols](https://fonts.google.com/icons?icon.style=Outlined)
 
### Example
`<span class="mso">dashboard</span>` should render 
[this icon](https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Adashboard%3AFILL%400%3Bwght%40200%3BGRAD%40-25%3Bopsz%4024):
![](doc/dashboard_FILL0_wght200_GRAD-25_opsz48.png) 

## Default Settings

The following font settings will be applied by default:

| Setting | Description |
|---------|-------------|
| fill    | 0           |
| weight  | 200         | 
| grade   | -25         |

## Overwriting defaults

For easier changes you can use one of the following classes to activate other font settings: 

| Class     | Change                      |
|-----------|-----------------------------|
| fill1     | activates font filling      |
| weight100 | sets the font-weight to 100 |
| weight300 | sets the font-weight to 300 | 
| weight400 | sets the font-weight to 400 | 
| weight500 | sets the font-weight to 500 | 
| weight600 | sets the font-weight to 600 | 
| weight700 | sets the font-weight to 700 | 
| grade0    | sets the grade to 0         | 
| grade200  | sets the grade to 200       |

### Example
- `<span class="mso">dashboard</span>` will render the dashboard icon with weight _200 (default!)_
- `<span class="mso weight400 grade200">dashboard</span>`  will render the dashboard icon with weight 400 and grade 200
