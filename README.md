[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7489783&assignment_repo_type=AssignmentRepo)
# Tarea {2} - Grupo{10}
Tarea2 - Programación Reactiva.


## Integrantes

Melisa Rodriguez

Diego Gonzalez

Maximiliano Schudeck

## Ejecución

Para ejecutar el programa, nosotros usamos `NodeJS`. Pueden instalar las dependencias con el comando `npm install` en la terminal en esta carpeta. Luego, para ejecutar el juego, basta con usar el comando `npm main.js`

## Un poco sobre la aplicación. 

Nuestra aplicación se centra en el uso de la librería `Rxjs`, que combinado con la herramienta `Canvas`, logra implementar un Pacman de 2 jugadores. Tanto Pacman como los fantasmas dependen de "Ticks", que en los observables, indica cada cuanto estos se mueven o generan un cambio en los datos. Luego, cuando ocurre algún evento, como una colisión, se utiliza la función `withLatestFrom()` que nos permite tomar la ultima instancia conocida de nuestro objeto y ejecutar los cambios. Luego, por cada FPS del programa, se ejecuta la función "render" que muestra los cambios al usuario.
