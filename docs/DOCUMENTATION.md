# Documentation of code_block_generator
## General description of the project:
- generatos.js - the main file that describes how the plugin works
- package.json - "instructions for building" the plugin
## Supported programming languages:
- C++
- Python
## Functions:
### 1. activate(context)

    The function that the plugin starts working with

### 2. generateCodeBlock(blockType)

At the user's request, the required code block is generated.

blockType - type of code block, example, "if", "for" and etc.

Example:
```JavaScript
generateCodeBlock("if")
```
It will insert it into the code:
```C++
if (condition) {

}
```

### 3. all functions of the get{blockType}Block(language)
Returns a block of code by {BlockType}, depending on the programming language the developer is writing in

Example:

```JavaScript
getIfBlock("cpp")
```
It will return:
```JavaScript
"if (condition) {\n\t\n\t}"
```

### 4. moveCursorToPlaceholder(editor, originalPosition, code)
Mmoves the cursor inside the inserted code block

Example:
```JavaScript
moveCursorToPlaceholder(editor, originalPosition, code)
```
It was (add "if" code block):
```C++
    if(condition) {

    }|
```

Become:

```C++
    if(condition|) {

    }
```

* "|" - cursor