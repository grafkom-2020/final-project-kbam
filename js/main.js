var scene, camera, fov, ratio, near, far, renderer, container,
    width, height,
    background, ground, cloudy;

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

// Buat Awan
function cloneCloud(){
    this.mesh = new THREE.Object3D();
    this.nClouds = 40; 
    this.clouds = [];
    // Buat angle awan
    var stepAngle = Math.PI*2 / this.nClouds;
    for(var i=0; i<this.nClouds; i++){
        var c = new Cloud();
        this.clouds.push(c);
        var a = stepAngle*i;
        var h = 750 + Math.random()*200;
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;
        c.mesh.position.z = -400-Math.random()*400;
        c.mesh.rotation.z = a + Math.PI/2;
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);
        this.mesh.add(c.mesh);
    }
}
  
function Cloud(){
    this.mesh = new THREE.Object3D();
    var geom = new THREE.SphereGeometry(15,15,15);
    var mat = new THREE.MeshBasicMaterial({
        color: 0xF0F0F0,
    });
    
    // Buat ukuran
    var nBlocs = 3+Math.floor(Math.random()*3);
    for (var i=0; i<nBlocs; i++ ){
        var m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.z = Math.random()*Math.PI*2;
        m.rotation.y = Math.random()*Math.PI*2;
        var s = .1 + Math.random()*.9;
        m.scale.set(s,s,s);
        this.mesh.add(m);
    }
}

function createCloud(){
    cloudy = new cloneCloud();
    cloudy.mesh.position.y = -500;
    scene.add(cloudy.mesh);
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
    // Animate Cloud
    cloudy.mesh.rotation.z += .01;
      
    requestAnimationFrame(loop);
}

// Initialisasi grafik
function init(){
    createScene();
    createBackground();
    createGround();
    createCloud();
    loop();
}

window.addEventListener('load', init, false);
