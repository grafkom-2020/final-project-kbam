var scene, camera, fov, ratio, near, far, renderer, container,
    width, height,
    background, ground;

var skyIndex = 0, skyIncrease = 1, skyTime = 0;
var skyColor = [
    0xD5E9FF,
    0xCAE4FF,
    0xBDDDFF,
    0xACD5FF,
    0x97CBFF,
    0x7DBEFF,
    0x70ABE5,
    0x6498CC,
    0x507AA3,
    0x406282
];

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
    var geometry = new THREE.PlaneGeometry(2500, 1500);
    var material = new THREE.MeshBasicMaterial({color: skyColor[skyIndex]});
    background = new THREE.Mesh(geometry, material);
    
    background.position.z = -600;
    scene.add(background);
}

// Buat Ground
function createGround(){
    var geometry = new THREE.CylinderGeometry(600,600,800,30,10);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var mat = new THREE.MeshBasicMaterial({
        color: 0xED8E4A,
        opacity : 0.6,
    });
    ground = new THREE.Mesh(geometry, mat);
    ground.receiveShadow = true;

    ground.position.y = -600;
    scene.add(ground);
}

// Animasi
function loop(){
    renderer.render(scene, camera);
    // Animate Sky
    if(skyTime < 120)
      skyTime++;
    else {
        if (skyIndex == 9 || (skyIncrease == 0 && skyIndex == 0))
            skyIncrease = !skyIncrease;
        
        if (skyIncrease)
            skyIndex++;
        else
            skyIndex--;

        background.material = new THREE.MeshBasicMaterial({color: skyColor[skyIndex]});
        skyTime = 0;
    }
    // Animate Ground
    ground.rotation.z += 0.005;

      
    requestAnimationFrame(loop);
}

// Initialisasi grafik
function init(){
    createScene();
    createBackground();
    createGround();
    loop();
}

window.addEventListener('load', init, false);