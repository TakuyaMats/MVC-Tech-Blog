const newFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#blog-title').value.trim();
    const description = document.querySelector('#blog-content').value.trim();

    if (title && description) {
        const response = await fetch('/api/dashboard', {
            method: 'POST',
            body: JSON.stringify({ title, description }),
            headers: { 'Content-Type' : 'application/json'},
        });

        if (response.ok) {
            document.location.replace('/login');
        } else {
            alert('Failed to create a new post');
        }
    }
};

document.querySelector('.new-blog-form').addEventListener('submit', newFormHandler);