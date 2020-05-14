var scene, camera, fov, ratio, near, far, renderer, container,
    width, height,
    background;

// Buat Scene
function createScene(){

    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    ratio = width / height;
    fov = 60;
    near = 1;
    far = 10000;
    camera = new THREE.PerspectiveCamera(
        fov, ratio, near, far
    );

    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
}

// Buat Background
function createBackground(){
    var geometry = new THREE.PlaneGeometry(height, width);
    var material = new THREE.MeshBasicMaterial({color: 0x7dbeff});
    background = new THREE.Mesh(geometry, material);
    
    background.position.z = -100;
    scene.add(background);
}

// Animasi
function loop(){
    renderer.render(scene, camera);
      
    requestAnimationFrame(loop);
}

// Initialisasi grafik
function init(){
    createScene();
    createBackground();
    loop();
}

window.addEventListener('load', init, false);