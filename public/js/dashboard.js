const newFormHandler = async (event) => {
    event.PreventDefault();

    const title = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#blog-content').value.trim();

    if (title && content) {
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