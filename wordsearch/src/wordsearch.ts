function wordsearch_app() {

    function getRandom(a: number, b: number): number {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    class WordSearch {

        size_cells: number;
        size_radius: number;

        size_m: number;
        size_n: number;

        words: string[];
        maze: [number, number][];

        ch_mat: string[][];
        id_mat: number[][];

        status_mat: number[][];
        resolved_w: number[];

        vocabulary: string[];

        hint_id: number;

        status = {
            init: 0,
            resolved: 1,
            selected: 2,
        }

        constructor(vocabulary: string[]) {
            this.size_m = 3;
            this.size_n = 4;

            this.size_radius = this.size_m * this.size_n;
            this.size_cells = this.size_radius * this.size_radius;        

            this.vocabulary = vocabulary;

            this.new();
        }

        new() {
            this.words = new Array();
            this.maze = new Array();

            this.select_words();
            this.build_maze();

            this.set_mat();

            this.hint_id = getRandom(0, this.words.length - 1);
            this.resolved_w = new Array();
        }

        hint() {

            if (this.resolved_w.indexOf(this.hint_id) < 0) {
                return this.hint_id;
            }

            if (this.resolved_w.length == this.words.length) {
                this.hint_id = -1;
            }

            let idx: number[] = new Array(this.words.length);

            for (let i = 0; i < idx.length; i++) {
                idx[i] = i;
            }

            for (let i = 0; i < idx.length; i++) {
                const rand_i = getRandom(i, idx.length - 1);

                [idx[i], idx[rand_i]] = [idx[rand_i], idx[i]];
            }

            for (let i = 0; i < idx.length; i++) {
                if (this.resolved_w.indexOf(idx[i]) < 0) {
                    this.hint_id = idx[i];

                    break;
                }
            }

            return this.hint_id;
        }

        select_words() {
            let N = this.size_cells;
            
            let idx: number[] = new Array(this.vocabulary.length);

            for (let i = 0; i < idx.length; i++) {
                idx[i] = i;
            }

            for (let i = 0; i < idx.length; i++) {
                const rand_i = getRandom(i, idx.length - 1);

                [idx[i], idx[rand_i]] = [idx[rand_i], idx[i]];
            }

            let all_len = 0;
            let curr_ind = 0;

            while (N - all_len > 20) {
                all_len += this.vocabulary[idx[curr_ind]].length;

                let new_word = this.vocabulary[idx[curr_ind]];

                this.words.push(new_word);

                curr_ind += 1;
            }

            for (let i = curr_ind; i < idx.length; i++) {
                for (let j = i + 1; j < idx.length; j++) {

                    let li = this.vocabulary[idx[i]].length;
                    let lj = this.vocabulary[idx[j]].length;

                    if (li + lj == N - all_len) {

                        let new_word_1 = this.vocabulary[idx[i]];
                        let new_word_2 = this.vocabulary[idx[j]];

                        this.words.push(new_word_1);
                        this.words.push(new_word_2);

                        all_len = N;
                        break;
                    }
                }
                if (all_len == N) {
                    break;
                }
            }
        }

        build_maze_part(size: number, start: [number, number]): [number, number][] {
            var path: [number, number][] = new Array();

            let used: Map<string, number> = new Map();
            let hist: number[] = new Array(size * size).fill(0);
     
            path.push(start);
            used[start.toString()] = 1;

            let dirs: [number, number][] = new Array();
            dirs = [[-1, 0], [0, -1], [0, 1], [1, 0]];

            let curr_p = start;

            while (true) {
                let insert_status = false;

                while (hist[path.length] != 15) {
                    let ind = path.length;
                    let rand_dir = getRandom(0, dirs.length - 1);

                    if ((hist[ind] & (1 << rand_dir)) == 0) {
                        let new_p: [number, number] = [
                            curr_p[0] + dirs[rand_dir][0],
                            curr_p[1] + dirs[rand_dir][1] ];

                        hist[ind] |= (1 << rand_dir);

                        if (new_p[0] < 0 || new_p[1] < 0) {
                            continue;
                        }

                        if (new_p[0] >= size || new_p[1] >= size) {
                            continue;
                        }
                        
                        if (!(new_p.toString() in used) ||
                            used[new_p.toString()] < 1) {
                            
                            insert_status = true;
                            path.push(new_p);

                            used[new_p.toString()] = 1;
                            curr_p = new_p;
                            break;
                        }
                    }
                }
               
                if (path.length == size * size) {
                    return path;
                }
               
                if (!insert_status) {
                    hist[path.length] = 0;

                    let p_last = path.pop();
                    used[p_last.toString()] = 0;

                    curr_p = path[path.length - 1];
                }  
            }
        }

        build_maze() {
            let start: [number, number] = [0, 0];
            
            let n = this.size_n;
            let m = this.size_m;

            let path_main = this.build_maze_part(n, start);

            for (let i = 0; i < path_main.length; i++) {
                let path_curr: [number, number][];
                
                if (i != path_main.length - 1) {
                    let diff: [number, number] = [
                        path_main[i + 1][0] - path_main[i][0],
                        path_main[i + 1][1] - path_main[i][1]];

                    while (true) {
                        path_curr = this.build_maze_part(m, start);
                        
                        let end = [
                            path_curr[path_curr.length - 1][0],
                            path_curr[path_curr.length - 1][1]];

                        if (diff[0] == -1 && end[0] == 0) {
                            start = [m - 1, end[1]];
                            break;
                        } else if (diff[1] == -1 && end[1] == 0) {
                            start = [end[0], m - 1];
                            break;
                        } else if (diff[1] == 1 && end[1] == m - 1) {
                            start = [end[0], 0];
                            break;
                        } else if (diff[0] == 1 && end[0] == m - 1) {
                            start = [0, end[1]];
                            break;
                       }
                    }
                } else {
                    path_curr = this.build_maze_part(m, start);
                }

                let offset: [number, number] = [
                    path_main[i][0] * m,
                    path_main[i][1] * m];

                for (let i = 0; i < path_curr.length; i++) {
                    let item = path_curr[i];
                    this.maze.push([
                        item[0] + offset[0],
                        item[1] + offset[1]]);
                } 
            }
        }

        set_mat() {
            this.id_mat = new Array(this.size_radius);
            this.ch_mat = new Array(this.size_radius);

            this.status_mat = new Array(this.size_radius);

            for(let i = 0; i < this.size_radius; i++) {

                this.id_mat[i] =
                    new Array(this.size_radius).fill(0);

                this.ch_mat[i] =
                    new Array(this.size_radius).fill('');

                this.status_mat[i] =
                    new Array(this.size_radius).fill(this.status.init);
            }

            let w_id = 0;
            let w_ch = 0;

            let coeff = 1;

            if (Math.round(Math.random())) {
                coeff = 1;
                w_ch = 0;
            } else {
                coeff = -1;
                w_ch = this.words[w_id].length - 1;
            }

            for(let item of this.maze) {

                this.id_mat[item[0]][item[1]] = w_id;
                this.ch_mat[item[0]][item[1]] = this.words[w_id][w_ch];

                w_ch += coeff;

                if (w_ch >= this.words[w_id].length || w_ch < 0) {
                    w_id += 1;

                    if(w_id >= this.words.length) {
                        break;
                    }

                    if (Math.round(Math.random())) {
                        coeff = 1;
                        w_ch = 0;
                    } else {
                        coeff = -1;
                        w_ch = this.words[w_id].length - 1;
                    }
                }
            }


        }
    }

    class App {
        app_canvas;

        ws: WordSearch;

        mouse_pos = {
            x: -1,
            y: -1
        };

        mousedown = false;

        hint_id = -1;

        config = {
            canvas: {
                w: 800,
                h: 700
            },

            title: {
                x: 400,
                y: 114
            },

            top_panel: {
                x: 40,
                y: 68,
                w: 720,
                h: 60
            },

            left_panel: {
                x: 40,
                y: 152,
                w: 12 * 36,
                h: 12 * 36,

                cell_size: 36
            },

            right_panel: {
                x: 500,
                y: 152,
                w: 260,
                h: 12 * 36
            },

            button_new: {
                x: 565,
                y: 570
            },

            button_hint: {
                x: 695,
                y: 570
            },

            background:
                '#eeddee',

            palette: [
                '#781c81',
                '#521b80',
                '#442f8b',
                '#3f4c9f',
                '#4069b4',
                '#4582c1',
                '#4e96bd',
                '#5aa6a9',
                '#68b090',
                '#7ab878',
                '#8dbc64',
                '#a2be56',
                '#b7bd4b',
                '#c9b843',
                '#d8ae3d',
                '#e29e37',
                '#e78632',
                '#e6672d',
                '#e14427',
                '#d92120' ]
        };

        create(data: string) {
            let vocabulary = data.split('\n').filter(x => x);
            this.ws = new WordSearch(vocabulary);

            this.app_canvas = document.createElement('canvas');

            this.app_canvas.width = this.config.canvas.w;
            this.app_canvas.height = this.config.canvas.h;

            this.app_canvas.style.width =
                this.config.canvas.w.toString() + 'px';
            this.app_canvas.style.height =
                this.config.canvas.h.toString() + 'px';

            this.app_canvas.style.display = 'block';
            this.app_canvas.style.margin = 'auto';

            document.body.appendChild(this.app_canvas);
            document.body.style.backgroundColor = this.config.background;

            for (let i = 0; i < this.config.palette.length; i++) {
                const rand_i = getRandom(i, this.config.palette.length - 1);

                [this.config.palette[i], this.config.palette[rand_i]] =
                    [this.config.palette[rand_i], this.config.palette[i]];
            }
            
            this.draw();

            this.app_canvas.onmousemove = function(e) {
                var r = this.getBoundingClientRect()

                var x = Math.round(e.clientX - r.left);
                var y = Math.round(e.clientY - r.top);

                if (app.mouse_pos.x != x ||
                    app.mouse_pos.y != y)
                {
                    app.mouse_pos.x = x;
                    app.mouse_pos.y = y;

                    if (app.mousedown &&
                        x - app.config.left_panel.x >= 0 &&
                        x - app.config.left_panel.x <
                            app.config.left_panel.w &&
                        y - app.config.left_panel.y >= 0 &&
                        y - app.config.left_panel.y <
                            app.config.left_panel.h)
                    {
                        let i = Math.floor((y - app.config.left_panel.y) /
                            app.config.left_panel.cell_size);

                        let j = Math.floor((x - app.config.left_panel.x) /
                            app.config.left_panel.cell_size);

                        if (app.ws.status_mat[i][j] == app.ws.status.init) {
                            app.ws.status_mat[i][j] = app.ws.status.selected;
                        }
                    }

                    app.draw();
                }
            }

            this.app_canvas.onmousedown = function(e) {
                app.mousedown = true;
            }

            this.app_canvas.onmouseup = function(e) {
                app.mousedown = false;

                if (Math.abs(app.mouse_pos.x - app.config.button_new.x) < 65 &&
                    Math.abs(app.mouse_pos.y - app.config.button_new.y) < 20 )
                {
                    app.new();
                }
                
                if (Math.abs(app.mouse_pos.x - app.config.button_hint.x) < 65 &&
                    Math.abs(app.mouse_pos.y - app.config.button_hint.y) < 20 )
                {
                    app.hint();
                }

                let selected_idx = new Array();

                for (let i = 0; i < app.ws.status_mat.length; ++i) {
                    for (let j = 0; j < app.ws.status_mat[i].length; ++j) {
                        if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                            selected_idx.push(app.ws.id_mat[i][j]);
                        }
                    }
                }

                let uniq_idx = Array.from(new Set(selected_idx));

                if (uniq_idx.length == 1 &&
                    app.ws.words[uniq_idx[0]].length == selected_idx.length)
                {
                    app.ws.resolved_w.push(uniq_idx[0]);

                    if (app.hint_id == uniq_idx[0]) {
                        app.hint_id -1;
                    }

                    for (let i = 0; i < app.ws.status_mat.length; ++i) {
                        for (let j = 0; j < app.ws.status_mat[i].length; ++j) {
                            if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                                app.ws.status_mat[i][j] = app.ws.status.resolved;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < app.ws.status_mat.length; ++i) {
                        for (let j = 0; j < app.ws.status_mat[i].length; ++j) {
                            if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                                app.ws.status_mat[i][j] = app.ws.status.init;
                            }
                        }
                    }
                }

                app.draw();
            }
        }

        new() {
            this.ws.new();
            this.hint_id = -1;

            for (let i = 0; i < this.config.palette.length; i++) {
                const rand_i = getRandom(i, this.config.palette.length - 1);

                [this.config.palette[i], this.config.palette[rand_i]] =
                    [this.config.palette[rand_i], this.config.palette[i]];
            }

            this.draw();
        }

        hint() {
            this.ws.hint();
            this.hint_id = this.ws.hint_id;
        }

        draw() {
            var canvas_ctx = this.app_canvas.getContext('2d');

            canvas_ctx.clearRect(
                0, 0,
                this.app_canvas.width, this.app_canvas.height);

            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(
                this.config.top_panel.x - 2 + 3,
                this.config.top_panel.y - 2 + 3,
                this.config.top_panel.w + 4 + 3,
                this.config.top_panel.h + 4 + 3);

            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(
                this.config.top_panel.x - 2,
                this.config.top_panel.y - 2,
                this.config.top_panel.w + 4,
                this.config.top_panel.h + 4);

            canvas_ctx.fillStyle = '#ffffff';
            canvas_ctx.fillRect(
                this.config.top_panel.x,
                this.config.top_panel.y,
                this.config.top_panel.w,
                this.config.top_panel.h);
            
            canvas_ctx.font = 'bold 42px Cutive Mono';
            canvas_ctx.textAlign = 'center';

            canvas_ctx.save();

            canvas_ctx.shadowColor = "rgb(190, 190, 190)";
            canvas_ctx.shadowOffsetX = 5;
            canvas_ctx.shadowOffsetY = 5;
            canvas_ctx.shadowBlur = 10;

            let grad = canvas_ctx.createLinearGradient(
                0, 0, this.app_canvas.width, 0);

            for (let i = 0; i < this.config.palette.length; ++i) {
                grad.addColorStop(
                    i / this.config.palette.length, this.config.palette[i]);
            }

            canvas_ctx.fillStyle = grad;

            canvas_ctx.fillText(
                '★ Word Search ★',
                this.config.title.x,
                this.config.title.y);

            canvas_ctx.restore();

            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(
                this.config.left_panel.x - 2 + 3,
                this.config.left_panel.y - 2 + 3,
                this.config.left_panel.w + 4 + 3,
                this.config.left_panel.h + 4 + 3);

            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(
                this.config.left_panel.x - 2,
                this.config.left_panel.y - 2,
                this.config.left_panel.w + 4,
                this.config.left_panel.h + 4);

            canvas_ctx.fillStyle = '#000000';
            canvas_ctx.fillRect(
                this.config.left_panel.x,
                this.config.left_panel.y,
                this.config.left_panel.w,
                this.config.left_panel.h);

            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(
                this.config.right_panel.x - 2 + 3,
                this.config.right_panel.y - 2 + 3,
                this.config.right_panel.w + 4 + 3,
                this.config.right_panel.h + 4 + 3);

            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(
                this.config.right_panel.x - 2,
                this.config.right_panel.y - 2,
                this.config.right_panel.w + 4,
                this.config.right_panel.h + 4);

            canvas_ctx.fillStyle = '#ffffff';
            canvas_ctx.fillRect(
                this.config.right_panel.x,
                this.config.right_panel.y,
                this.config.right_panel.w,
                this.config.right_panel.h);
            
            let y_offset = this.config.left_panel.y + 16 + 5;

            for(let i = 0; i < this.ws.size_radius; i++) {
                let x_offset = this.config.left_panel.x + 16;

                for (let j = 0; j < this.ws.size_radius; j++) {

                    canvas_ctx.fillStyle = '#ffffff';
                    canvas_ctx.font = '30px Cutive Mono';

                    if (this.ws.status_mat[i][j] == this.ws.status.init &&
                        this.ws.id_mat[i][j] == this.hint_id)
                    {
                        canvas_ctx.fillStyle = '#ffffff';
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }

                    if (this.ws.status_mat[i][j] == this.ws.status.selected)
                    {
                        canvas_ctx.fillStyle = 'red';
                        canvas_ctx.font = 'bold 30px Cutive Mono';

                        canvas_ctx.fillText(
                            this.ws.ch_mat[i][j],
                            x_offset + 2,
                            y_offset + 2);

                        canvas_ctx.fillStyle = '#ffffff';
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }

                    if (this.ws.status_mat[i][j] == this.ws.status.resolved)
                    {
                        canvas_ctx.fillStyle =
                            this.config.palette[
                                this.ws.id_mat[i][j] %
                                    this.config.palette.length ];

                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }

                    if (this.ws.status_mat[i][j] == this.ws.status.init &&
                        Math.abs(x_offset - this.mouse_pos.x) < 18 &&
                        y_offset - this.mouse_pos.y >= 0 &&
                        y_offset - this.mouse_pos.y < 36)
                    {
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }

                    canvas_ctx.fillText(
                        this.ws.ch_mat[i][j],
                        x_offset,
                        y_offset);

                    x_offset += this.config.left_panel.cell_size;
                }

                y_offset += this.config.left_panel.cell_size;
            }

            canvas_ctx.save();

            canvas_ctx.shadowColor = "rgb(190, 190, 190)";
            canvas_ctx.shadowOffsetX = 5;
            canvas_ctx.shadowOffsetY = 5;
            canvas_ctx.shadowBlur = 10;

            y_offset = this.config.right_panel.y + 25;

            for (let i = 0; i < this.ws.resolved_w.length; ++i) {
                let x_offset = this.config.right_panel.x + 40;

                canvas_ctx.fillStyle = '#000000';
                canvas_ctx.font = '20px Cutive Mono';
                canvas_ctx.textAlign = 'left';

                canvas_ctx.fillText(
                    '✓',
                    x_offset - 25,
                    y_offset);

                canvas_ctx.font = 'bold 20px Cutive Mono';

                canvas_ctx.fillText(
                    this.ws.words[this.ws.resolved_w[i]],
                    x_offset,
                    y_offset);

                y_offset += 18;
            }

            canvas_ctx.restore();

            if (this.hint_id != -1 &&
                this.ws.resolved_w.indexOf(this.hint_id) < 0) {
                let x_offset = this.config.right_panel.x + 40;

                canvas_ctx.fillStyle = '#666666';
                canvas_ctx.font = '20px Cutive Mono';
                canvas_ctx.textAlign = 'left';

                canvas_ctx.fillText(
                    this.ws.words[this.hint_id],
                    x_offset,
                    y_offset);
            }

            canvas_ctx.fillStyle = '#000000';
            canvas_ctx.textAlign = 'center';

            canvas_ctx.font = '18px Cutive Mono';

            if( Math.abs(this.mouse_pos.x - this.config.button_new.x) < 65 &&
                Math.abs(this.mouse_pos.y - this.config.button_new.y) < 20 )
            {
                canvas_ctx.font = 'bold 18px Cutive Mono';

                canvas_ctx.save();

                canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                canvas_ctx.shadowOffsetX = 5;
                canvas_ctx.shadowOffsetY = 5;
                canvas_ctx.shadowBlur = 10;

                canvas_ctx.fillText(
                    'NEW',
                    this.config.button_new.x,
                    this.config.button_new.y);

                canvas_ctx.restore();
            } else {
                canvas_ctx.fillText(
                    'NEW',
                    this.config.button_new.x,
                    this.config.button_new.y);
            }

            canvas_ctx.font = '18px Cutive Mono';

            if (this.ws.resolved_w.length < this.ws.words.length) {

                if( Math.abs(this.mouse_pos.x - this.config.button_hint.x) < 65 &&
                    Math.abs(this.mouse_pos.y - this.config.button_hint.y) < 20 )
                {
                    canvas_ctx.font = 'bold 18px Cutive Mono';
                    
                    canvas_ctx.save();

                    canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                    canvas_ctx.shadowOffsetX = 5;
                    canvas_ctx.shadowOffsetY = 5;
                    canvas_ctx.shadowBlur = 10;

                    canvas_ctx.fillText(
                        'HINT',
                        this.config.button_hint.x,
                        this.config.button_hint.y);

                    canvas_ctx.restore();
                } else {
                    canvas_ctx.fillText(
                        'HINT',
                        this.config.button_hint.x,
                        this.config.button_hint.y);
                }

            } else {

                if( Math.abs(this.mouse_pos.x - this.config.button_hint.x) < 65 &&
                    Math.abs(this.mouse_pos.y - this.config.button_hint.y) < 20 )
                {
                    canvas_ctx.font = 'bold 18px Cutive Mono';

                    canvas_ctx.save();

                    canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                    canvas_ctx.shadowOffsetX = 5;
                    canvas_ctx.shadowOffsetY = 5;
                    canvas_ctx.shadowBlur = 10;

                    canvas_ctx.fillText(
                        '\\(•_•)/',
                        this.config.button_hint.x,
                        this.config.button_hint.y);

                    canvas_ctx.restore();
                } else {
                    canvas_ctx.fillText(
                        '(•_•)',
                        this.config.button_hint.x,
                        this.config.button_hint.y);
                }
            }
        }
    }

    async function loadDeps() {

        const data_url = 'data/vocabulary.txt'

        const response = await fetch(data_url);
        const data = await response.text();

        const font_url = /* https://fonts.googleapis.com/css?family=Cutive+Mono */
            "url(https://fonts.gstatic.com/s/cutivemono/v7/m8JWjfRfY7WVjVi2E-K9H6RCTm4.woff2) format('woff2')";

        const fontface = new FontFace('Cutive Mono', font_url);
        const font = await fontface.load();

        document.fonts.add(font);

        app.create(data);
    }

    var app = new App();

    loadDeps();

};

wordsearch_app();
