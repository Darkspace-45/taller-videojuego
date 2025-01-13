const displayRecord = (username: string, recordScore: number): void => {
    const recordContainer = document.getElementById("record-container");
    if (recordContainer) {
        recordContainer.innerHTML = `
            <p>Nombre: ${username}</p>
            <p>Récord: ${recordScore}</p>
        `;
    } else {
        console.error("El contenedor para mostrar el récord no se encontró.");
    }
};