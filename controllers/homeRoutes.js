const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Get all blogs and JOIN with user data
        const blogData = await Blog.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }, ],
        });

        // Serialize data so the template can read it
        const blogs = blogData.map((blog) => blog.get({
            plain: true
        }));

        // Pass serialized data and session flag into template
        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [
            {
                model: User,
                attributes: ['name'],
            },
            {
                model: Comment,
                attributes: ['comment, date_created']
            },
        ],
        });

        const blog = blogData.get({
            plain: true
        });

        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ["password" ]},
            include: [
                {
                    model: Post
                },
            ],
        });
        
        const users = userData.map((user) => user.get({ plain: true }));


        res.render('dashboard', {
            ...users
        })

    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/blog');
        return;
    }

    res.render('login');
});

module.exports = router;