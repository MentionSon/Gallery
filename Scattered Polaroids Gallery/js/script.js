'use strict';

//1  数据的遍历分组
//2  生成元素节点
//3  绑定事件
//4  显示到容器中

(function(window, document) {

    let Gallery = {
        startGallery({data, parastifer}) {
            Gallery.init(data);
            Gallery.show(parastifer);
            Gallery.bind();
        },
        photos: [],
        navs: [],
        init(data) {
            for (let s in data) {
                let photo = document.createElement('div');
                photo.innerHTML = `<div class="photo-wrap">
                    <div class="side side-front">
                        <p class="image"></p>
                        <p class="caption">${data[s].caption}</p>
                    </div>
                    <div class="side side-back">
                        <p class="desc">${data[s].desc}</p>
                    </div>
                </div>`
                photo.className = `photo photo-back`;
                photo.id = `photo_${s}`;
                Gallery.photos.push(photo);
                Gallery.navs.push(`<span class="i" id="nav-${s}"></span>`);  
            }        
        },
        show(parastifer) {
            let wrap = document.getElementById(parastifer);        
            console.log(wrap);
            for (let s of Gallery.photos) {
                wrap.appendChild(s);
            }
            let navBar = document.createElement('div');
            navBar.innerHTML = Gallery.navs.join('');
            navBar.className = 'nav-bar';
            wrap.appendChild(navBar);
            Gallery.reSort(Gallery.random([0, Gallery.photos.length]));
            console.log(Gallery.calPostion());
        },
        reSort(n) {
            let _photos = document.querySelectorAll('.photo');
            let photos = [];
            
            for (let s of _photos) {
                s.className = s.className.replace(/\s*photo-center\s*/, '');

                photos.push(s); 
            }

            let photo = document.getElementById('photo_' + n);
            console.log(photo);
            photo.className += ' photo-center';
            photo = photos.splice(n, 1)[0];
            console.log(photos.length);

            // 将海报分为左右两个区域
            let photosLeft = photos.splice(0,Math.floor(photos.length/2));
            let photosRight = photos;
            let position = Gallery.calPostion();
            for (let s of photosLeft) { 
                s.className = 'photo photo-back';         
                s.style.left = Gallery.random(position.left.x) + 'px';
                s.style.top = Gallery.random(position.left.y) + 'px';
                s.style.transform = `rotate(${Gallery.random([0, 360])}deg)`;
            }
            for (let s of photosRight) {
                s.className = 'photo photo-back';
                s.style.left = Gallery.random(position.right.x) + 'px';
                s.style.top = Gallery.random(position.right.y) + 'px';
                s.style.transform = `rotate(${Gallery.random([0, 360])}deg)`;
            }
            for (let s of document.querySelectorAll('.i')) {
                s.className = 'i';
            }
            document.getElementById('nav-' + n).className += ' i-current';
            console.log(document.getElementById('nav-' + n));
        },
        bind() {
            let navBar = document.querySelector('.nav-bar');
            navBar.addEventListener('click', e => {
                if (e.target.nodeName === 'SPAN') {
                    if (/i-current/.test(e.target.className)) {
                        let photos = document.querySelector('.photo-center');
                        if (/i-back/.test(e.target.className)) {
                            e.target.className = e.target.className.replace(/\s*i-back\s*/, '');
                            photos.className = photos.className.replace(/front/, 'back');
                        } else {
                            e.target.className += ' i-back';
                            photos.className = photos.className.replace(/back/, 'front');
                        }
                    } else {
                        let key = e.target.id.replace(/nav-/, '');
                        Gallery.reSort(key);
                        console.log(key);
                    }
                } else {
                    e.stopPropagation();
                    return false;
                }
            })
            let photos = document.querySelectorAll('.photo');
            for (let s of photos) {
                s.addEventListener('click', e => {
                    let elc = e.currentTarget.className;
                    let icon = document.querySelector('.i-current')
                    if (/\s*photo-center\s*/.test(elc)) {
                        if (/front/.test(elc)) {
                            icon.className = icon.className.replace(/\s*i-back\s*/, '');                           
                            elc = elc.replace(/front/, 'back');
                        } else {
                            elc = elc.replace(/back/, 'front');
                            icon.className += ' i-back';
                        }
                        e.currentTarget.className = elc;
                    } else {
                        let key = e.currentTarget.id.replace(/photo_/, '');
                        Gallery.reSort(key);
                        console.log(key);
                    }
                    console.log(e.currentTarget.id);   
                });
            }
        },
        random(range) {
            let max = Math.max(range[0], range[1]);
            let min = Math.min(range[0], range[1]);

            let diff = max - min;
            let num = Math.floor(Math.random()*diff + min);
            return num;
        },
        calPostion() {
            let range = {
                left: {
                    x: [],
                    y: []
                },
                right: {
                    x: [],
                    y: []
                }
            };

            let wrap = {
                w: document.getElementById('#wrap').clientWidth,
                h: document.getElementById('#wrap').clientHeight
            };
            let photo ={
                w: document.querySelector('.photo').clientWidth,
                h: document.querySelector('.photo').clientHeight
            };

            range.wrap = wrap;
            range.photo = photo;

            range.left.x = [(1-photo.w), (wrap.w/2 - photo.w)];
            range.left.y = [(1-photo.h), wrap.h];
            range.right.x = [(wrap.w/2 + photo.w), (wrap.w + photo.w)];
            range.right.y = range.left.y;

            return range;
        }
    }
    
    window.Gallery = Gallery.startGallery;
})(window, document);
