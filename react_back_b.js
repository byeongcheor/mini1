// -- 전원 공통 부분
var http = require('http');
var fs = require("fs");
var express = require("express");
var app = express();
var session = require('express-session');
var server = http.createServer(app);
// post전송방식의 데이터 request를 위한 설정
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var flow = require('nimble');
const path = require('path');
//--DB Connection---------------------------------------
var mysql = require('mysql2');
// MySQL 데이터베이스 연결 설정
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "flower",
    password: "flower1234",
    database: "plantdb"
});
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});
var cors = require('cors');
app.use(cors());
app.use(express.json());

// 병철님 사용 모듈----------------------------
const multer = require('multer');

const { log } = require('console');
const { compileFunction } = require('vm');
const { post } = require('request');

app.use(session({
    secret: 'your_secret_key', // 비밀키 설정
    resave: false,
    saveUninitialized: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// uploads 폴더 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// public/img 폴더 생성
const publicImgDir = path.join(__dirname, 'public', 'img');
if (!fs.existsSync(publicImgDir)) {
    fs.mkdirSync(publicImgDir, { recursive: true });
}

// Multer 설정
const storageUploads = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const storagePublicImg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicImgDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadToUploads = multer({ storage: storageUploads });
const uploadToPublicImg = multer({ storage: storagePublicImg });

// 이미지 업로드 엔드포인트 (uploads 폴더)
app.post('/uploadProfile', uploadToUploads.single('profileImage'), (req, res) => {
    const userid = req.body.userid;
    const profileImageUrl = `/uploads/${req.file.filename}`;

    // 파일 경로를 DB에 저장
    const sql = `UPDATE usertbl SET profileImageUrl = ? WHERE userid = ?`;
    connection.query(sql, [profileImageUrl, userid], (err, result) => {
        if (err) {
            console.error('Error updating profile image:', err);
            return res.status(500).send('Error updating profile image');
        }
        res.json({ profileImageUrl });
    });
});


// 이미지 업로드 엔드포인트 (public/img 폴더)
app.post('/uploadFilesToPublicImg', uploadToPublicImg.array('files', 10), (req, res) => {
    try {
        const filePaths = req.files.map(file => ({
            filePath: `${file.filename}`
        }));
        res.json({ files: filePaths });
    } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        res.status(500).send('파일 업로드 실패');
    }
});


// 회원가입 요청 처리
app.post('/join', function (request, response) {
    try {
        var { userid, userpwd, username, useremail, usernike, usertel, zipcode, useraddr, prefer } = request.body;

        // 요청 데이터 로그 출력
        console.log("Received data:", request.body);

        // prefer 데이터를 JSON 문자열로 변환
        var preferences = JSON.stringify(prefer);

        // SQL 쿼리 동적 생성
        var columns = ['userid', 'userpwd', 'username', 'useremail', 'usernike', 'usertel'];
        var values = [userid, userpwd, username, useremail, usernike, usertel];

        if (zipcode) {
            columns.push('zipcode');
            values.push(zipcode);
        }
        if (useraddr) {
            columns.push('useraddr');
            values.push(useraddr);
        }
        if (preferences) {
            columns.push('prefer');
            values.push(preferences);
        }

        var sql = `INSERT INTO usertbl (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;

        // 데이터베이스에 데이터 삽입
        connection.execute(sql, values, function (error, result) {
            if (error) {
                console.error("Error inserting data:", error);
                response.status(500).json({ result: 0 });
            } else {
                response.json({ result: 1 });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.status(500).json({ result: 0 });
    }
});

// 로그인 요청 처리
app.post('/login', function (request, response) {
    try {
        var { userid, userpwd } = request.body;

        var sql = "SELECT userid, username FROM usertbl WHERE userid = ? AND userpwd = ?";
        connection.execute(sql, [userid, userpwd], function (error, result) {
            if (!error && result.length > 0) { // 로그인 성공
                request.session.user = {
                    userid: result[0].userid,
                    username: result[0].username,
                    authorized: true
                };
                response.json({ logState: "Y", userid: result[0].userid });
            } else { // 로그인 실패
                response.json({ logState: "N" });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.status(500).json({ logState: "N" });
    }
});

// 로그아웃 요청 처리
app.get("/logout", function (request, response) {
    try {
        request.session.destroy((err) => {
            if (err) {
                console.log("로그아웃 에러:", err);
                response.status(500).json({ logout: 'no' });
            } else {
                console.log("로그아웃.. 세션 지우기");
                response.json({ logout: 'yes' });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.status(500).json({ logout: 'no' });
    }
});

// 아이디 찾기 요청 처리
app.post('/findId', function (request, response) {
    try {
        var { username, usertel } = request.body;
        var sql = 'SELECT userid FROM usertbl WHERE username = ? AND usertel = ?';
        connection.execute(sql, [username, usertel], function (error, result) {
            if (error) {
                console.error("Error finding ID:", error);
                response.status(500).json({ result: null });
            } else if (result.length > 0) {
                response.json({ result: result[0].userid });
            } else {
                response.json({ result: null });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.json({ result: null });
    }
});

// 비밀번호 찾기 1단계 요청 처리
app.post('/findPwd', function (request, response) {
    try {
        var { userid } = request.body;
        var sql = 'SELECT userid FROM usertbl WHERE userid = ?';
        connection.execute(sql, [userid], function (error, result) {
            if (error) {
                console.error("Error finding password:", error);
                response.status(500).json({ result: null });
            } else if (result.length > 0) {
                response.json({ result: result[0].userid });
            } else {
                response.json({ result: null });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.status(500).json({ result: null });
    }
});

// 비밀번호 변경 요청 처리
app.post('/findPwd2', function (request, response) {
    try {
        var { userid, userpwd } = request.body;
        var sql = 'UPDATE usertbl SET userpwd = ? WHERE userid = ?';
        connection.execute(sql, [userpwd, userid], function (error, result) {
            if (error) {
                console.error("Error updating password:", error);
                response.status(500).json({ result: 0 });
            } else {
                response.json({ result: 1 });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.status(500).json({ result: 0 });
    }
});

// 문의하기
app.post('/inquiry', function (request, response) {
    // 문의 제목
    var subject = request.body.subject;

    // 문의 내용
    var content = request.body.content;
    var userid = request.body.userid;

    // 작성자
    var sql = 'insert into inquirytbl (subject,content,userid) values(?,?,?)';
    connection.execute(sql, [subject, content, userid], function (error, result) {
        if (!error || result.affectedRows > 0) {
            response.json({ result: 1 });

        } else {
            response.json({ result: 0 });
        }
    })
})

// 문의 리스트
app.get('/inquirydetailslist', function (request, response) {
    var userid = request.query.userid;
    console.log(userid);
    var sql = "select Inquiry_index, subject,userid, ";
    sql += " date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
    sql += "from inquirytbl where userid=? order by Inquiry_index desc";
    connection.execute(sql, [userid], function (error, results) {
        sql = "select Inquiry_index from answertbl"
        connection.execute(sql, function (error, answerindex) {
            response.json({ result: results, answerindex });
        })

    });
});

// 문의 내역보기
app.get('/inquiryDetails', function (request, response) {
    let param = request.url.substring(request.url.indexOf('?') + 1);
    let data = new URLSearchParams(param);
    let Inquiry_index = data.get("Inquiry_index");
    let sql = 'select Inquiry_index,subject, content,userid ,';
    sql += " date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
    sql += "from inquirytbl where Inquiry_index=? ";
    connection.execute(sql, [Inquiry_index], function (error, result) {
        console.log(param);
        response.json({ record: result[0] });
    });

});
// 문의 답변보기
app.get('/inquiryReplies', function (request, response) {
    let param = request.url.substring(request.url.indexOf('?') + 1);
    let data = new URLSearchParams(param);
    let Inquiry_index = data.get("Inquiry_index");
    let sql = 'select inquiry_index,content, userid, ';
    sql += "date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
    sql += "from answertbl where inquiry_index=?";
    connection.execute(sql, [Inquiry_index], function (error, result) {
        console.log(result);
        if (result.length != 0) {

            response.json({ record: result, on: 1 });
        } else {

            response.json({ on: 0 });
        }
    })


});
// 문의 답변하기 
app.post('/inquiryReply', function (request, response) {
    const Inquiry_index = request.body.Inquiry_index;
    const content = request.body.reply;
    const userid = request.body.userid;
    var sql = 'insert into answertbl (inquiry_index,content,userid) values(?,?,?)'
    connection.execute(sql, [Inquiry_index, content, userid], function (error, result) {
        if (!error || result.affectedRows > 0) {
            response.json({ result: 1 });

        } else {
            response.json({ result: 0 });
        }
    })
})
// 댓글 추가
app.post("/addComment", function(request, response) {
    const post_index = request.body.post_index;
    const content = request.body.content;
    const userid = request.body.userid;

    const sql = 'INSERT INTO commenttbl (userid, post_index, content) VALUES (?, ?, ?)';
    connection.execute(sql, [userid, post_index, content], function(error, result) {
        console.log(post_index);
        console.log(content);
        console.log(userid);
       
        if (!error && result.affectedRows > 0) {
            response.json({ result: 1 });
        } else {
            response.json({ result: 0 });
        }
    });
});

// 댓글 불러오기
app.get('/postReplies', function(request, response) {
    let param = request.url.substring(request.url.indexOf('?') + 1);
    let data = new URLSearchParams(param);
    let post_index = data.get("post_index");

    const sql = `
        SELECT c.userid, c.content, DATE_FORMAT(c.writedate, "%Y-%m-%d %H:%i") AS writedate, u.profileImageUrl, u.usernike 
        FROM commenttbl c
        JOIN usertbl u ON c.userid = u.userid 
        WHERE c.post_index = ?
    `;
    
    connection.execute(sql, [post_index], function(error, result) {
        if (error) {
            console.error(error);
            response.status(500).send('Internal Server Error');
        } else {
            //  이미지 경로프로필를 절대 경로로 설정
            result.forEach(row => {
                row.profileImageUrl = row.profileImageUrl;
            });
            response.json({ record: result });
        }
    });
});
// 문의 수정하기 
app.post('/editReply', function (request, response) {
    const Inquiry_index = request.body.Inquiry_index;
    const content = request.body.content;
    var sql = "update answertbl set content=? where Inquiry_index=?";
    connection.execute(sql, [content, Inquiry_index], function (error, result) {
        if (!error || result.affectedRows > 0) {
            response.json({ result: 1 });

        } else {
            response.json({ result: 0 });
        }
    });


});
// 사용자 이름 조회 엔드포인트 추가
app.get('/getUsername', function (request, response) {
    try {
        const userid = request.query.userid;

        if (!userid) {
            return response.status(400).json({ error: 'User ID is required' });
        }

        // 데이터베이스 쿼리 실행
        const sql = "SELECT username, usernike, usertel, useremail, profileImageUrl FROM usertbl WHERE userid = ?";
        connection.execute(sql, [userid], function (error, results) {
            if (error) {
                console.error("Error querying database:", error);
                return response.status(500).json({ error: 'Database query failed' });
            }

            if (results.length > 0) {
                response.json({
                    username: results[0].username,
                    usernike: results[0].usernike,
                    usertel: results[0].usertel,
                    useremail: results[0].useremail,
                    profileImageUrl: results[0].profileImageUrl
                });
            } else {
                response.json({ error: 'User not found' });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        response.json({ error: 'Unexpected error occurred' });
    }
});
// 글삭제
app.get('/listDel', function (request, response) {
    var Inquiry_index = request.query.Inquiry_index;

    var sql = 'DELETE FROM inquirytbl WHERE Inquiry_index = ?';
    connection.execute(sql, [Inquiry_index], function (error, result) {
        if (error) {
            console.error("Error deleting inquiry:", error);
            response.status(500).json({ result: 0 });
        } else {
            response.json({ result: 1 });
        }
    });
});
// 내가쓴글삭제  //DB가 없어서 값을 제대로 못넣음
app.get('/myclistDel', function (request, response) {
    var Inquiry_index = request.query.Inquiry_index;

    var sql = 'DELETE FROM inquirytbl WHERE Inquiry_index = ?';
    connection.execute(sql, [Inquiry_index], function (error, result) {
        if (error) {
            console.error("Error deleting inquiry:", error);
            response.json({ result: 0 });
        } else {
            response.json({ result: 1 });
        }
    });
});

app.post('/changeform1', function (request, response) {
    try {
        var { userid, usernike, usertel, useremail, prefer } = request.body;

        // null 값 처리
        usernike = usernike || null;
        usertel = usertel || null;
        useremail = useremail || null;
        prefer = prefer ? JSON.stringify(prefer) : null;

        var sql = 'UPDATE usertbl SET usernike = ?, usertel = ?, useremail = ?, prefer = ? WHERE userid = ?';
        connection.execute(sql, [usernike, usertel, useremail, prefer, userid], function (error, result) {
            if (error) {
                console.error("update error", error);
                response.json({ result: 0 });
            } else {
                response.json({ result: 1 });
            }
        });
    } catch (err) {
        console.error("error:", err);
        response.json({ result: 0 });
    }
});


// 내가 쓴글보기 
app.post('/mycommunitylist', function (request, response) {
    var userid = request.body.userid;
    
    var sql = "select post_index, subject,userid,hit,  ";
    sql += " date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
    sql += " from posttbl where userid=? order by post_index desc";
    connection.execute(sql, [userid], function (error, results) {
        
        response.json({ result: results });
    });
});

//좋아요한 글
app.post('/likelist', function (request, response) {
    const userid = request.body.userid;
    var sql2 = "select post_index, subject,userid, ";
    sql2 += "date_format(writedate,'%Y-%m-%d %H:%i') writedate";
    sql2 += " from posttbl where post_index in (select post_index from liketbl where userid = ?)";
    connection.execute(sql2, [userid], function (error, results) {
        if (error) {
            console.log(error);

        } else {
            response.json({ result: results });
        }
    });


});

// 스크랩한 글 리스트
app.post('/scraplist', function (request, response) {
    const userid = request.body.userid;
    console.log(userid);
    var sql2 = " select post_index, subject,userid, ";
     sql2 +=" date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
     sql2 +=" from posttbl where post_index in (select post_index from scripttbl where userid = ?)";
    connection.execute(sql2, [userid], function (error, results) {
        if (error) {
            
            console.log(error);

        } else {
            
            console.log(results);
            response.json({ result: results });
        }
    });
});
// 관리자 전체문의
app.post('/rootlist', function (request, response) {
    var sql = "select Inquiry_index, subject,userid, ";
    sql += " date_format(writedate,'%Y-%m-%d %H:%i') writedate ";
    sql += "from inquirytbl order by Inquiry_index desc";
    connection.execute(sql, function (error, results) {
        sql = "select Inquiry_index from answertbl"
        connection.execute(sql, function (error, answerindex) {
            response.json({ result: results, answerindex });
        })

    })

})
// 관리자 모든회원목록
app.post('/userlist', function (request, response) {

    var sql = 'select userid , username, usernike,useremail,usertel,profileImageUrl,';
    sql += "date_format(registerdate,'%Y-%m-%d %H:%i') registerdate ";
    sql += 'from usertbl ';

    connection.execute(sql, function (error, results) {
        response.json({ result: results });

    });

})

// 수정님 DB 영역--------------------------------------------

app.get('/plant', (request, response) => {
    const sortMethod = request.query.sort || 'name'; // 기본 정렬 방법은 이름순
    let sql = 'SELECT plant_index, plantkor, img, difficulty, planttype FROM planttbl';

    if (sortMethod == '/name') {
        sql += ' ORDER BY plantkor';
    } else if (sortMethod == '/difficulty') {
        sql += ' ORDER BY difficulty';
    }

    connection.execute(sql, function (error, results) {

        response.json({ result: results });

    });
});

app.post('/plant', function (request, response) {
    const filters = request.body.filters;
    var sql = "select plant_index, plantkor, img, difficulty, planttype from planttbl ";
    if (filters.plantOptions.length > 0) {
        var string = JSON.stringify(filters.plantOptions);
        string = string.substring(1, string.length - 1);
        sql += "where planttype in (" + string + ")";
    }
    console.log(sql);
    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
        } else {
            response.json({ result: results });
        }
    })

})

app.get('/plantcare', function (request, response) {
    console.log(request.url);
    let param = request.url.substring(request.url.indexOf('?') + 1);  //?plant_indxex=번호
    let data = new URLSearchParams(param);  // palnt_index=
    let plant_index = data.get("plant_index");

    let sql = "select plant_index, plantkor, planteng, content, water, sun, humidity, temp, plantdistinct, img from planttbl where plant_index = ?";

    connection.execute(sql, [plant_index], function (error, result) { // [{  }]
        console.log(result);
        response.json({ record: result[0] });
    });
});

// 영선님 DB 영역--------------------------------------------

// 게시판 목록
app.get('/community', function (request, response) {
    const sortMethod = request.query.sort || 'hit';
    console.log(sortMethod);
    var sql = " select p.post_index, p.subject, p.hit, p.userid, DATE_FORMAT(p.writedate, '%y-%m-%d %H:%i') AS writedate, p.img, ";
    sql += "COALESCE(l.likes, 0) AS likes, COALESCE(s.scrap, 0) AS scrap FROM posttbl p ";
    sql += "LEFT JOIN (SELECT post_index, COUNT(*) AS likes FROM liketbl GROUP BY post_index) l ON p.post_index = l.post_index ";
    sql += "LEFT JOIN (SELECT post_index, COUNT(*) AS scrap FROM scripttbl GROUP BY post_index) s ";
    sql += "ON p.post_index = s.post_index"
    if (sortMethod == '/like') {
        sql += " order by likes desc";
    } else if (sortMethod == '/scrap') {
        sql += " order by scrap desc";
    } else if (sortMethod == '/newest') {
        sql += " order by post_index desc";
    } else {
        sql += " order by hit desc";
    }

    connection.execute(sql, function (error, results) {
        if (error) {
            console.log(error);
        }

        sql = " select p.post_index, p.subject, p.hit, p.userid, DATE_FORMAT(p.writedate, '%y-%m-%d %H:%i') AS writedate, p.img, "
        sql += "COALESCE(l.likes, 0) AS likes, COALESCE(s.scrap, 0) AS scrap FROM posttbl p ";
        sql += "LEFT JOIN (SELECT post_index, COUNT(*) AS likes FROM liketbl GROUP BY post_index) l ON p.post_index = l.post_index ";
        sql += "LEFT JOIN (SELECT post_index, COUNT(*) AS scrap FROM scripttbl GROUP BY post_index) s ";
        sql += "ON p.post_index = s.post_index ";
        sql += "order by hit desc limit 2";

        connection.execute(sql, function (error, results2) {
            if (error) {
                console.log(error);
            } else {
                // console.log("처음 받은거 : ", results, ", 조회수 높은 2개 : ", results2)
                response.json({ result: results, topresult: results2 });
            }
        })
        // console.log(results)
        // response.json({ result: results });

    });
});

app.post('/communityForm', function (request, response) {
    var subject = request.body.subject; //제목
    var content = request.body.content;//글내용
    var userid = request.body.userid;//작성자
    var img = request.body.img;
    var newPostIndex = '';
    flow.series([
        function (callback) {
            setTimeout(function () {
                var sql = "insert into posttbl(subject,userid, img) values(?,?, ?)";
                connection.execute(sql, [subject, userid, img[0]], function (error, result) {
                    if (error || result.affectedRows == 0) {// 글등록 실패
                        response.json({ result: 0 });

                    } else {//글등록 성공
                        newPostIndex = result.insertId;
                        console.log('newPostIndex', newPostIndex);

                    }
                });
                callback();
            }, 1000);
        },
        function (callback) {
            setTimeout(function () {
                var sql = "INSERT INTO post_content (post_index, content, img) VALUES ?";


                var insertValues = [];
                for (var i = 0; i < img.length; i++) {
                    insertValues.push([newPostIndex, content[i], img[i]]);
                }
                console.log(insertValues);
                connection.query(sql, [insertValues], function (err, results) {

                    if (err || results.affectedRows == 0) {
                        response.json({ result: 0 });
                    } else {
                        response.json({ result: 1 });
                    }
                });
                callback();

            }, 500);
        }
    ]);

});


// 뉴스글 선택

app.get('/communityView', function (request, response) {
    let param = request.url.substring(request.url.indexOf('?') + 1);
    let data = new URLSearchParams(param);
    let post_index = data.get("post_index");
    let userid = data.get("userid"); // 클라이언트에서 userid를 쿼리 파라미터로 보내야 함

    let sql = "update posttbl set hit=hit+1 where post_index=?";
    connection.execute(sql, [post_index], function (error, result) {
        if (error) {
            console.log(error);
            response.status(500).send('Internal Server Error');
            return;
        } else {
            sql = "select post_index, subject, userid, hit, ";
            sql += "date_format(writedate,'%y-%m-%d %H:%i') writedate from posttbl where post_index=?";

            connection.execute(sql, [post_index], function (error, result) {
                if (error) {
                    console.error(error);
                    response.status(500).send('Internal Server Error');
                    return;
                } else {
                    sql = "select usernike, profileImageUrl from usertbl where userid = ?";
                    connection.execute(sql, [result[0].userid], function (error, userinfo) {
                        if (error) {
                            console.error(error);
                            response.status(500).send('Internal Server Error');
                            return;
                        } else {
                            sql = "select content, img from post_content where post_index = ?";
                            connection.execute(sql, [result[0].post_index], function (error, result2) {
                                if (error) {
                                    console.error(error);
                                    response.status(500).send('Internal Server Error');
                                    return;
                                } else {
                                    sql = "select count(*) 'like' from liketbl where post_index = ?";
                                    connection.execute(sql, [post_index], function (error, like) {
                                        if (error) {
                                            console.error(error);
                                            response.status(500).send('Internal Server Error');
                                            return;
                                        } else {
                                            sql = "select count(*) 'scrap' from scripttbl where post_index = ?";
                                            connection.execute(sql, [post_index], function (error, scrap) {
                                                if (error) {
                                                    console.error(error);
                                                    response.status(500).send('Internal Server Error');
                                                    return;
                                                } else {
                                                    // 사용자의 좋아요 및 스크랩 상태 확인
                                                    sql = "select liked from liketbl where post_index = ? and userid = ?";
                                                    connection.execute(sql, [post_index, userid], function (error, likeStatus) {
                                                        if (error) {
                                                            console.error(error);
                                                            response.status(500).send('Internal Server Error');
                                                            return;
                                                        } else {
                                                            sql = "select scripted from scripttbl where post_index = ? and userid = ?";
                                                            connection.execute(sql, [post_index, userid], function (error, scrapStatus) {
                                                                if (error) {
                                                                    console.error(error);
                                                                    response.status(500).send('Internal Server Error');
                                                                    return;
                                                                } else {
                                                                    response.json({
                                                                        record: result[0],
                                                                        records: result2,
                                                                        like: like[0],
                                                                        scrap: scrap[0],
                                                                        userinfo: userinfo[0],
                                                                        likeStatus: likeStatus.length ? likeStatus[0].liked : 1,
                                                                        scrapStatus: scrapStatus.length ? scrapStatus[0].scripted : 1
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/likeclick', (req, res) => {
    const { userid, post_index } = req.body;

    connection.execute('SELECT liked FROM liketbl WHERE userid = ? AND post_index = ?', [userid, post_index], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length > 0 && result[0].liked === 0) {
            connection.execute('DELETE FROM liketbl WHERE userid = ? AND post_index = ?', [userid, post_index], (err, deleteResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({ result: 2 }); // 좋아요 취소
            });
        } else {
            connection.execute('INSERT INTO liketbl (userid, post_index, liked) VALUES (?, ?, 0)', [userid, post_index], (err, insertResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({ result: 1 }); // 좋아요 추가
            });
        }
    });
});

app.post('/scrapclick', (req, res) => {
    const { userid, post_index } = req.body;

    connection.execute('SELECT scripted FROM scripttbl WHERE userid = ? AND post_index = ?', [userid, post_index], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (result.length > 0 && result[0].scripted === 0) {
            connection.execute('DELETE FROM scripttbl WHERE userid = ? AND post_index = ?', [userid, post_index], (err, deleteResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({ result: 2 }); // 스크랩 취소
            });
        } else {
            connection.execute('INSERT INTO scripttbl (userid, post_index, scripted) VALUES (?, ?, 0)', [userid, post_index], (err, insertResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({ result: 1 }); // 스크랩 추가
            });
        }
    });
});

app.post('/communityEditOk', function (request, response) {
    var post_index = request.body.post_index;
    var subject = request.body.subject;
    var content = request.body.content; // 글내용
    var userid = request.body.userid; // 작성자 (여기서는 하드코딩된 값이지만 실제로는 세션이나 다른 방법을 통해 가져와야 함)
    var img = request.body.img; // 이미지 배열

    console.log("===================");
    console.log("img -> ", img);
    console.log("content -> ", content);
    console.log("subject", subject);
    console.log("index ->", post_index);

    // 첫 번째 이미지를 메인 이미지로 설정
    var mainImg = img[0];

    flow.series([
        function (callback) {
            setTimeout(function () {
                var sql = "update posttbl set subject=?, img=? where post_index=?";
                connection.execute(sql, [subject, mainImg, post_index], function (error, result) {
                    if (error || result.affectedRows == 0) { // 글 수정 실패
                        response.json({ result: 0 });
                    } else { // 글 수정 성공
                        console.log("업데이트 성공");
                    }
                });
                callback();
            }, 1000);
        },
        function (callback) {
            setTimeout(function () {
                var sql_del = "DELETE FROM post_content WHERE post_index = ?";
                connection.execute(sql_del, [post_index], function (error, result) {
                    if (error || result.affectedRows == 0) {
                        // 에러 발생 시 응답을 보내고 callback을 호출하지 않음
                        response.json({ result: 0 });
                    } else {
                        console.log("삭제 성공");
                        // 성공 시 callback 호출
                        callback();
                    }
                });
            }, 500);
        },
        function (callback) {
            setTimeout(function () {
                var sql_insert = "INSERT INTO post_content (post_index, content, img) VALUES ?";

                var insertValues = [];
                for (var i = 0; i < Math.min(img.length, content.length); i++) {
                    insertValues.push([post_index, content[i], img[i]]);
                }
                console.log(insertValues);
                connection.query(sql_insert, [insertValues], function (err, results) {
                    if (err || results.affectedRows == 0) {
                        response.json({ result: 0 });
                    } else {
                        console.log("재등록성공");
                        response.json({ result: 1 });
                    }
                });
            }, 200);
        }
    ]);
});

// 글삭제
app.post('/communityDel', function (request, response) {
    var post_index = request.body.post_index;
    console.log(post_index);
    var sql = "delete from posttbl where post_index=?";

    connection.execute(sql, [post_index], function (error, result) {
        if (error || result.affectedRows == 0) {
            console.log('삭제실패');
            console.error(error);
            response.json({ result: 0 });
        } else {
            console.log('삭제성공');
            response.json({ result: 1 });
        }
    })
});
app.post('/likeclick', function(request, response){
    var userid = request.body.userid;
    var post_index = request.body.post_index;
    console.log(userid, post_index);
    var sql = "select * from liketbl where userid = ? && post_index = ?"
    connection.execute(sql, [userid, post_index], function(error, result){
        if(error){
            console.error(error);
            response.json({result : 0});
        }else if(result.length == 0){
            sql = "insert into liketbl(userid, post_index) value(?, ?);"
            connection.execute(sql, [userid, post_index], function(error, result){
                if(error){
                    console.error(error);
                }else{
                    console.log("등록하였습니다.")
                    response.json({result : 1});
                }
            })
        }
        else{
            sql = "delete from liketbl where userid = ? && post_index = ?";
            connection.execute(sql, [userid, post_index], function(error, result){
                if(error){
                    console.error(error);
                }else{
                    console.log("삭제하였습니다.")
                    response.json({result : 2});
                }
            })
        }
    })
})
app.post('/scrapclick', function(request, response){
    var userid = request.body.userid;
    var post_index = request.body.post_index;
    console.log(userid, post_index);
    var sql = "select * from scripttbl where userid = ? && post_index = ?"
    connection.execute(sql, [userid, post_index], function(error, result){
        if(error){
            console.error(error);
            response.json({result : 0});
        }else if(result.length == 0){
            sql = "insert into scripttbl(userid, post_index) value(?, ?);"
            connection.execute(sql, [userid, post_index], function(error, result){
                if(error){
                    console.error(error);
                }else{
                    console.log("등록하였습니다.")
                    response.json({result : 1});
                }
            })
        }
        else{
            sql = "delete from scripttbl where userid = ? && post_index = ?";
            connection.execute(sql, [userid, post_index], function(error, result){
                if(error){
                    console.error(error);
                }else{
                    console.log("삭제하였습니다.")
                    response.json({result : 2});
                }
            })
        }
    })
})





// 수정님, 영선님 이미지 처리--------------------------------------------------------------------


app.use(express.static(path.join(__dirname, 'public')));

//---------------------------------------------------------


// 병조 파트----------------------------------------------

app.post('/searchok', function (request, response) {
    var search = request.body.search;
    console.log(search);
    var sql = "select * from posttbl where CONCAT_WS('', userid, subject, content) LIKE '%?%'";
    connection.execute(sql, [search], function (error, result) {
        if (error || result.affectedRows == 0) { // 글 등록 실패
            response.json({ result: 0 });
        } else {     //글 등록 성공
            response.json({ result: 1 });
        }
    });

});

//---------------------------지금 쓰는거
app.get('/searchresult', function (request, response) {
    let params = request.url.substring(request.url.indexOf("?") + 1); // search=keyword
    let data = new URLSearchParams(params);
    let search = data.get("search");

    // Example SQL queries to get counts and results for each category
    let sqlCommunity = "SELECT COUNT(*) AS community_count FROM posttbl WHERE CONCAT_WS('', userid, subject) LIKE ?";
    let sqlPlant = "SELECT COUNT(*) AS plant_count FROM planttbl WHERE CONCAT_WS('', plantkor, content) LIKE ?";
    let sqlEvent = "SELECT COUNT(*) AS event_count FROM liketbl WHERE CONCAT_WS('', userid, post_index) LIKE ?";
    let sqlCommunityResults = "SELECT post_index, userid, subject, writedate, img FROM posttbl WHERE CONCAT_WS('', userid, subject) LIKE ? order by writedate desc";
    let sqlPlantResults = "SELECT plant_index, plantkor, img FROM planttbl WHERE CONCAT_WS('', plantkor, content) LIKE ?";
    let sqlEventResults = "SELECT * FROM liketbl WHERE CONCAT_WS('', userid, post_index) LIKE ?";

    // Variables to store results
    let searchResult = {
        record: [],
        community_count: 0,
        plant_count: 0,
        event_count: 0
    };

    // Execute queries to get counts and results for each category
    connection.execute(sqlCommunity, ['%' + search + '%'], function (error, result) {
        if (error) {
            console.error(error);
            response.status(500).json({ error: "Database query error" });
            return;
        }
        searchResult.community_count = result[0].community_count;

        // Execute query to get community results
        connection.execute(sqlCommunityResults, ['%' + search + '%'], function (error, result) {
            if (error) {
                console.error(error);
                response.status(500).json({ error: "Database query error" });
                return;
            }
            searchResult.record = searchResult.record.concat(result);

            // Execute query to get plant count
            connection.execute(sqlPlant, ['%' + search + '%'], function (error, result) {
                if (error) {
                    console.error(error);
                    response.status(500).json({ error: "Database query error" });
                    return;
                }
                searchResult.plant_count = result[0].plant_count;

                // Execute query to get plant results
                connection.execute(sqlPlantResults, ['%' + search + '%'], function (error, result) {
                    if (error) {
                        console.error(error);
                        response.status(500).json({ error: "Database query error" });
                        return;
                    }
                    searchResult.record = searchResult.record.concat(result);

                    // Execute query to get event count
                    connection.execute(sqlEvent, ['%' + search + '%'], function (error, result) {
                        if (error) {
                            console.error(error);
                            response.status(500).json({ error: "Database query error" });
                            return;
                        }
                        searchResult.event_count = result[0].event_count;

                        // Execute query to get event results
                        connection.execute(sqlEventResults, ['%' + search + '%'], function (error, result) {
                            if (error) {
                                console.error(error);
                                response.status(500).json({ error: "Database query error" });
                                return;
                            }
                            searchResult.record = searchResult.record.concat(result);

                            // Return final search result
                            response.json(searchResult);
                        });
                    });
                });
            });
        });
    });
});


// 서버 시작
server.listen(20000, function () {
    console.log('server start..... http://127.0.0.1:20000');
});