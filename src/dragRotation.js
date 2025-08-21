export function initRotationByMouseDragging(renderer, model) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0, z: 0 };
    const damping = 0.01; // closer to 1 = slower decay, smoother inertia

    renderer.domElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        if (!isDragging || !model)
            return;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        //velocity.z = deltaX * 0.5; // horizontal drag = rotation around Y
        //velocity.y = deltaY * 0.5; // vertical drag = rotation around X
        model.rotation.z -= deltaX * 0.003; // horizontal drag rotates around Y
        model.rotation.y += deltaY * 0.003; // vertical drag rotates around X

        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
    });

    return { velocity, damping };
}
