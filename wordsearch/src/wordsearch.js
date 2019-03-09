var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function wordsearch_app() {
    function getRandom(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    var WordSearch = /** @class */ (function () {
        function WordSearch(vocabulary) {
            this.status = {
                init: 0,
                resolved: 1,
                selected: 2
            };
            this.size_m = 3;
            this.size_n = 4;
            this.size_radius = this.size_m * this.size_n;
            this.size_cells = this.size_radius * this.size_radius;
            this.vocabulary = vocabulary;
            this["new"]();
        }
        WordSearch.prototype["new"] = function () {
            this.words = new Array();
            this.maze = new Array();
            this.select_words();
            this.build_maze();
            this.set_mat();
            this.hint_id = getRandom(0, this.words.length - 1);
            this.resolved_w = new Array();
        };
        WordSearch.prototype.hint = function () {
            var _a;
            if (this.resolved_w.indexOf(this.hint_id) < 0) {
                return this.hint_id;
            }
            if (this.resolved_w.length == this.words.length) {
                this.hint_id = -1;
            }
            var idx = new Array(this.words.length);
            for (var i = 0; i < idx.length; i++) {
                idx[i] = i;
            }
            for (var i = 0; i < idx.length; i++) {
                var rand_i = getRandom(i, idx.length - 1);
                _a = [idx[rand_i], idx[i]], idx[i] = _a[0], idx[rand_i] = _a[1];
            }
            for (var i = 0; i < idx.length; i++) {
                if (this.resolved_w.indexOf(idx[i]) < 0) {
                    this.hint_id = idx[i];
                    break;
                }
            }
            return this.hint_id;
        };
        WordSearch.prototype.select_words = function () {
            var _a;
            var N = this.size_cells;
            var idx = new Array(this.vocabulary.length);
            for (var i = 0; i < idx.length; i++) {
                idx[i] = i;
            }
            for (var i = 0; i < idx.length; i++) {
                var rand_i = getRandom(i, idx.length - 1);
                _a = [idx[rand_i], idx[i]], idx[i] = _a[0], idx[rand_i] = _a[1];
            }
            var all_len = 0;
            var curr_ind = 0;
            while (N - all_len > 20) {
                all_len += this.vocabulary[idx[curr_ind]].length;
                var new_word = this.vocabulary[idx[curr_ind]];
                this.words.push(new_word);
                curr_ind += 1;
            }
            for (var i = curr_ind; i < idx.length; i++) {
                for (var j = i + 1; j < idx.length; j++) {
                    var li = this.vocabulary[idx[i]].length;
                    var lj = this.vocabulary[idx[j]].length;
                    if (li + lj == N - all_len) {
                        var new_word_1 = this.vocabulary[idx[i]];
                        var new_word_2 = this.vocabulary[idx[j]];
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
        };
        WordSearch.prototype.build_maze_part = function (size, start) {
            var path = new Array();
            var used = new Map();
            var hist = new Array(size * size).fill(0);
            path.push(start);
            used[start.toString()] = 1;
            var dirs = new Array();
            dirs = [[-1, 0], [0, -1], [0, 1], [1, 0]];
            var curr_p = start;
            while (true) {
                var insert_status = false;
                while (hist[path.length] != 15) {
                    var ind = path.length;
                    var rand_dir = getRandom(0, dirs.length - 1);
                    if ((hist[ind] & (1 << rand_dir)) == 0) {
                        var new_p = [
                            curr_p[0] + dirs[rand_dir][0],
                            curr_p[1] + dirs[rand_dir][1]
                        ];
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
                    var p_last = path.pop();
                    used[p_last.toString()] = 0;
                    curr_p = path[path.length - 1];
                }
            }
        };
        WordSearch.prototype.build_maze = function () {
            var start = [0, 0];
            var n = this.size_n;
            var m = this.size_m;
            var path_main = this.build_maze_part(n, start);
            for (var i = 0; i < path_main.length; i++) {
                var path_curr = void 0;
                if (i != path_main.length - 1) {
                    var diff = [
                        path_main[i + 1][0] - path_main[i][0],
                        path_main[i + 1][1] - path_main[i][1]
                    ];
                    while (true) {
                        path_curr = this.build_maze_part(m, start);
                        var end = [
                            path_curr[path_curr.length - 1][0],
                            path_curr[path_curr.length - 1][1]
                        ];
                        if (diff[0] == -1 && end[0] == 0) {
                            start = [m - 1, end[1]];
                            break;
                        }
                        else if (diff[1] == -1 && end[1] == 0) {
                            start = [end[0], m - 1];
                            break;
                        }
                        else if (diff[1] == 1 && end[1] == m - 1) {
                            start = [end[0], 0];
                            break;
                        }
                        else if (diff[0] == 1 && end[0] == m - 1) {
                            start = [0, end[1]];
                            break;
                        }
                    }
                }
                else {
                    path_curr = this.build_maze_part(m, start);
                }
                var offset = [
                    path_main[i][0] * m,
                    path_main[i][1] * m
                ];
                for (var i_1 = 0; i_1 < path_curr.length; i_1++) {
                    var item = path_curr[i_1];
                    this.maze.push([
                        item[0] + offset[0],
                        item[1] + offset[1]
                    ]);
                }
            }
        };
        WordSearch.prototype.set_mat = function () {
            this.id_mat = new Array(this.size_radius);
            this.ch_mat = new Array(this.size_radius);
            this.status_mat = new Array(this.size_radius);
            for (var i = 0; i < this.size_radius; i++) {
                this.id_mat[i] =
                    new Array(this.size_radius).fill(0);
                this.ch_mat[i] =
                    new Array(this.size_radius).fill('');
                this.status_mat[i] =
                    new Array(this.size_radius).fill(this.status.init);
            }
            var w_id = 0;
            var w_ch = 0;
            var coeff = 1;
            if (Math.round(Math.random())) {
                coeff = 1;
                w_ch = 0;
            }
            else {
                coeff = -1;
                w_ch = this.words[w_id].length - 1;
            }
            for (var _i = 0, _a = this.maze; _i < _a.length; _i++) {
                var item = _a[_i];
                this.id_mat[item[0]][item[1]] = w_id;
                this.ch_mat[item[0]][item[1]] = this.words[w_id][w_ch];
                w_ch += coeff;
                if (w_ch >= this.words[w_id].length || w_ch < 0) {
                    w_id += 1;
                    if (w_id >= this.words.length) {
                        break;
                    }
                    if (Math.round(Math.random())) {
                        coeff = 1;
                        w_ch = 0;
                    }
                    else {
                        coeff = -1;
                        w_ch = this.words[w_id].length - 1;
                    }
                }
            }
        };
        return WordSearch;
    }());
    var App = /** @class */ (function () {
        function App() {
            this.mouse_pos = {
                x: -1,
                y: -1
            };
            this.mousedown = false;
            this.hint_id = -1;
            this.config = {
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
                background: '#eeddee',
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
                    '#d92120'
                ]
            };
        }
        App.prototype.create = function (data) {
            var _a;
            var vocabulary = data.split('\n').filter(function (x) { return x; });
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
            for (var i = 0; i < this.config.palette.length; i++) {
                var rand_i = getRandom(i, this.config.palette.length - 1);
                _a = [this.config.palette[rand_i], this.config.palette[i]], this.config.palette[i] = _a[0], this.config.palette[rand_i] = _a[1];
            }
            this.draw();
            this.app_canvas.onmousemove = function (e) {
                var r = this.getBoundingClientRect();
                var x = Math.round(e.clientX - r.left);
                var y = Math.round(e.clientY - r.top);
                if (app.mouse_pos.x != x ||
                    app.mouse_pos.y != y) {
                    app.mouse_pos.x = x;
                    app.mouse_pos.y = y;
                    if (app.mousedown &&
                        x - app.config.left_panel.x >= 0 &&
                        x - app.config.left_panel.x <
                            app.config.left_panel.w &&
                        y - app.config.left_panel.y >= 0 &&
                        y - app.config.left_panel.y <
                            app.config.left_panel.h) {
                        var i = Math.floor((y - app.config.left_panel.y) /
                            app.config.left_panel.cell_size);
                        var j = Math.floor((x - app.config.left_panel.x) /
                            app.config.left_panel.cell_size);
                        if (app.ws.status_mat[i][j] == app.ws.status.init) {
                            app.ws.status_mat[i][j] = app.ws.status.selected;
                        }
                    }
                    app.draw();
                }
            };
            this.app_canvas.onmousedown = function (e) {
                app.mousedown = true;
            };
            this.app_canvas.onmouseup = function (e) {
                app.mousedown = false;
                if (Math.abs(app.mouse_pos.x - app.config.button_new.x) < 65 &&
                    Math.abs(app.mouse_pos.y - app.config.button_new.y) < 20) {
                    app["new"]();
                }
                if (Math.abs(app.mouse_pos.x - app.config.button_hint.x) < 65 &&
                    Math.abs(app.mouse_pos.y - app.config.button_hint.y) < 20) {
                    app.hint();
                }
                var selected_idx = new Array();
                for (var i = 0; i < app.ws.status_mat.length; ++i) {
                    for (var j = 0; j < app.ws.status_mat[i].length; ++j) {
                        if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                            selected_idx.push(app.ws.id_mat[i][j]);
                        }
                    }
                }
                var uniq_idx = Array.from(new Set(selected_idx));
                if (uniq_idx.length == 1 &&
                    app.ws.words[uniq_idx[0]].length == selected_idx.length) {
                    app.ws.resolved_w.push(uniq_idx[0]);
                    if (app.hint_id == uniq_idx[0]) {
                        app.hint_id - 1;
                    }
                    for (var i = 0; i < app.ws.status_mat.length; ++i) {
                        for (var j = 0; j < app.ws.status_mat[i].length; ++j) {
                            if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                                app.ws.status_mat[i][j] = app.ws.status.resolved;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < app.ws.status_mat.length; ++i) {
                        for (var j = 0; j < app.ws.status_mat[i].length; ++j) {
                            if (app.ws.status_mat[i][j] == app.ws.status.selected) {
                                app.ws.status_mat[i][j] = app.ws.status.init;
                            }
                        }
                    }
                }
                app.draw();
            };
        };
        App.prototype["new"] = function () {
            var _a;
            this.ws["new"]();
            this.hint_id = -1;
            for (var i = 0; i < this.config.palette.length; i++) {
                var rand_i = getRandom(i, this.config.palette.length - 1);
                _a = [this.config.palette[rand_i], this.config.palette[i]], this.config.palette[i] = _a[0], this.config.palette[rand_i] = _a[1];
            }
            this.draw();
        };
        App.prototype.hint = function () {
            this.ws.hint();
            this.hint_id = this.ws.hint_id;
        };
        App.prototype.draw = function () {
            var canvas_ctx = this.app_canvas.getContext('2d');
            canvas_ctx.clearRect(0, 0, this.app_canvas.width, this.app_canvas.height);
            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(this.config.top_panel.x - 2 + 3, this.config.top_panel.y - 2 + 3, this.config.top_panel.w + 4 + 3, this.config.top_panel.h + 4 + 3);
            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(this.config.top_panel.x - 2, this.config.top_panel.y - 2, this.config.top_panel.w + 4, this.config.top_panel.h + 4);
            canvas_ctx.fillStyle = '#ffffff';
            canvas_ctx.fillRect(this.config.top_panel.x, this.config.top_panel.y, this.config.top_panel.w, this.config.top_panel.h);
            canvas_ctx.font = 'bold 42px Cutive Mono';
            canvas_ctx.textAlign = 'center';
            canvas_ctx.save();
            canvas_ctx.shadowColor = "rgb(190, 190, 190)";
            canvas_ctx.shadowOffsetX = 5;
            canvas_ctx.shadowOffsetY = 5;
            canvas_ctx.shadowBlur = 10;
            var grad = canvas_ctx.createLinearGradient(0, 0, this.app_canvas.width, 0);
            for (var i = 0; i < this.config.palette.length; ++i) {
                grad.addColorStop(i / this.config.palette.length, this.config.palette[i]);
            }
            canvas_ctx.fillStyle = grad;
            canvas_ctx.fillText('★ Word Search ★', this.config.title.x, this.config.title.y);
            canvas_ctx.restore();
            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(this.config.left_panel.x - 2 + 3, this.config.left_panel.y - 2 + 3, this.config.left_panel.w + 4 + 3, this.config.left_panel.h + 4 + 3);
            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(this.config.left_panel.x - 2, this.config.left_panel.y - 2, this.config.left_panel.w + 4, this.config.left_panel.h + 4);
            canvas_ctx.fillStyle = '#000000';
            canvas_ctx.fillRect(this.config.left_panel.x, this.config.left_panel.y, this.config.left_panel.w, this.config.left_panel.h);
            canvas_ctx.fillStyle = '#857f93';
            canvas_ctx.fillRect(this.config.right_panel.x - 2 + 3, this.config.right_panel.y - 2 + 3, this.config.right_panel.w + 4 + 3, this.config.right_panel.h + 4 + 3);
            canvas_ctx.fillStyle = '#3d3059';
            canvas_ctx.fillRect(this.config.right_panel.x - 2, this.config.right_panel.y - 2, this.config.right_panel.w + 4, this.config.right_panel.h + 4);
            canvas_ctx.fillStyle = '#ffffff';
            canvas_ctx.fillRect(this.config.right_panel.x, this.config.right_panel.y, this.config.right_panel.w, this.config.right_panel.h);
            var y_offset = this.config.left_panel.y + 16 + 5;
            for (var i = 0; i < this.ws.size_radius; i++) {
                var x_offset = this.config.left_panel.x + 16;
                for (var j = 0; j < this.ws.size_radius; j++) {
                    canvas_ctx.fillStyle = '#ffffff';
                    canvas_ctx.font = '30px Cutive Mono';
                    if (this.ws.status_mat[i][j] == this.ws.status.init &&
                        this.ws.id_mat[i][j] == this.hint_id) {
                        canvas_ctx.fillStyle = '#ffffff';
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }
                    if (this.ws.status_mat[i][j] == this.ws.status.selected) {
                        canvas_ctx.fillStyle = 'red';
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                        canvas_ctx.fillText(this.ws.ch_mat[i][j], x_offset + 2, y_offset + 2);
                        canvas_ctx.fillStyle = '#ffffff';
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }
                    if (this.ws.status_mat[i][j] == this.ws.status.resolved) {
                        canvas_ctx.fillStyle =
                            this.config.palette[this.ws.id_mat[i][j] %
                                this.config.palette.length];
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }
                    if (this.ws.status_mat[i][j] == this.ws.status.init &&
                        Math.abs(x_offset - this.mouse_pos.x) < 18 &&
                        y_offset - this.mouse_pos.y >= 0 &&
                        y_offset - this.mouse_pos.y < 36) {
                        canvas_ctx.font = 'bold 30px Cutive Mono';
                    }
                    canvas_ctx.fillText(this.ws.ch_mat[i][j], x_offset, y_offset);
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
            for (var i = 0; i < this.ws.resolved_w.length; ++i) {
                var x_offset = this.config.right_panel.x + 40;
                canvas_ctx.fillStyle = '#000000';
                canvas_ctx.font = '20px Cutive Mono';
                canvas_ctx.textAlign = 'left';
                canvas_ctx.fillText('✓', x_offset - 25, y_offset);
                canvas_ctx.font = 'bold 20px Cutive Mono';
                canvas_ctx.fillText(this.ws.words[this.ws.resolved_w[i]], x_offset, y_offset);
                y_offset += 18;
            }
            canvas_ctx.restore();
            if (this.hint_id != -1 &&
                this.ws.resolved_w.indexOf(this.hint_id) < 0) {
                var x_offset = this.config.right_panel.x + 40;
                canvas_ctx.fillStyle = '#666666';
                canvas_ctx.font = '20px Cutive Mono';
                canvas_ctx.textAlign = 'left';
                canvas_ctx.fillText(this.ws.words[this.hint_id], x_offset, y_offset);
            }
            canvas_ctx.fillStyle = '#000000';
            canvas_ctx.textAlign = 'center';
            canvas_ctx.font = '18px Cutive Mono';
            if (Math.abs(this.mouse_pos.x - this.config.button_new.x) < 65 &&
                Math.abs(this.mouse_pos.y - this.config.button_new.y) < 20) {
                canvas_ctx.font = 'bold 18px Cutive Mono';
                canvas_ctx.save();
                canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                canvas_ctx.shadowOffsetX = 5;
                canvas_ctx.shadowOffsetY = 5;
                canvas_ctx.shadowBlur = 10;
                canvas_ctx.fillText('NEW', this.config.button_new.x, this.config.button_new.y);
                canvas_ctx.restore();
            }
            else {
                canvas_ctx.fillText('NEW', this.config.button_new.x, this.config.button_new.y);
            }
            canvas_ctx.font = '18px Cutive Mono';
            if (this.ws.resolved_w.length < this.ws.words.length) {
                if (Math.abs(this.mouse_pos.x - this.config.button_hint.x) < 65 &&
                    Math.abs(this.mouse_pos.y - this.config.button_hint.y) < 20) {
                    canvas_ctx.font = 'bold 18px Cutive Mono';
                    canvas_ctx.save();
                    canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                    canvas_ctx.shadowOffsetX = 5;
                    canvas_ctx.shadowOffsetY = 5;
                    canvas_ctx.shadowBlur = 10;
                    canvas_ctx.fillText('HINT', this.config.button_hint.x, this.config.button_hint.y);
                    canvas_ctx.restore();
                }
                else {
                    canvas_ctx.fillText('HINT', this.config.button_hint.x, this.config.button_hint.y);
                }
            }
            else {
                if (Math.abs(this.mouse_pos.x - this.config.button_hint.x) < 65 &&
                    Math.abs(this.mouse_pos.y - this.config.button_hint.y) < 20) {
                    canvas_ctx.font = 'bold 18px Cutive Mono';
                    canvas_ctx.save();
                    canvas_ctx.shadowColor = "rgb(190, 190, 190)";
                    canvas_ctx.shadowOffsetX = 5;
                    canvas_ctx.shadowOffsetY = 5;
                    canvas_ctx.shadowBlur = 10;
                    canvas_ctx.fillText('\\(•_•)/', this.config.button_hint.x, this.config.button_hint.y);
                    canvas_ctx.restore();
                }
                else {
                    canvas_ctx.fillText('(•_•)', this.config.button_hint.x, this.config.button_hint.y);
                }
            }
        };
        return App;
    }());
    function loadDeps() {
        return __awaiter(this, void 0, void 0, function () {
            var data_url, response, data, font_url, fontface, font;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data_url = 'data/vocabulary.txt';
                        return [4 /*yield*/, fetch(data_url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        data = _a.sent();
                        font_url = "url(https://fonts.gstatic.com/s/cutivemono/v7/m8JWjfRfY7WVjVi2E-K9H6RCTm4.woff2) format('woff2')";
                        fontface = new FontFace('Cutive Mono', font_url);
                        return [4 /*yield*/, fontface.load()];
                    case 3:
                        font = _a.sent();
                        document.fonts.add(font);
                        app.create(data);
                        return [2 /*return*/];
                }
            });
        });
    }
    var app = new App();
    loadDeps();
}
;
wordsearch_app();
