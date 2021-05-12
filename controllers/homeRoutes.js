const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }, ],
        });

        const blogs = blogData.map((blog) => blog.get({
            plain: true
        }));

        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [
            {
                model: User,
                attributes: ['username'],
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

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ["password" ]},
            include: [
                {
                    model: Blog
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
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: {
                exclude: ["password"]
            }
        });

        res.status(200).json(userData);

    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne({
            attributes: {
                exclude: ["password"]
            },
            where: {
                id: req.params.id,
            },
            include: [{
                model: Blog,
                attributes: ["id", "title", "description", "date_created"],
            }, ],
        });

        if (!userData) {
            res.status(404).json({
                message: `No user with the ID ${req.params.id} found`
            });
            return;
        }
        res.status(200).json(userData);


    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;