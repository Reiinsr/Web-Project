<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Add Event</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success { color: #28a745; background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { color: #dc3545; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { color: #004085; background: #cce5ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>Test Add Event API</h1>
        
        <div id="results"></div>
        
        <button onclick="testAddEvent()">Test Add Event</button>
        <button onclick="testGetEvents()">Test Get Events</button>
        <button onclick="testDatabase()">Test Database Connection</button>
        
        <div id="output"></div>
    </div>
    
    <script>
        function showResult(message, type) {
            const resultsDiv = document.getElementById('results');
            const div = document.createElement('div');
            div.className = type;
            div.innerHTML = message;
            resultsDiv.appendChild(div);
        }
        
        function testDatabase() {
            document.getElementById('output').innerHTML = '<pre>Testing database connection...</pre>';
            fetch('test_connection.php')
                .then(res => res.text())
                .then(html => {
                    document.getElementById('output').innerHTML = html;
                })
                .catch(err => {
                    showResult('Error: ' + err.message, 'error');
                });
        }
        
        function testGetEvents() {
            document.getElementById('output').innerHTML = '<pre>Testing get_events.php...</pre>';
            fetch('api/get_events.php')
                .then(res => res.text())
                .then(text => {
                    if (text.trim().startsWith('<?php')) {
                        showResult('❌ PHP is NOT executing - raw PHP code returned', 'error');
                        document.getElementById('output').innerHTML = '<pre>' + text.substring(0, 500) + '</pre>';
                    } else {
                        try {
                            const data = JSON.parse(text);
                            showResult('✓ API returned valid JSON with ' + data.length + ' events', 'success');
                            document.getElementById('output').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        } catch (e) {
                            showResult('❌ Invalid JSON: ' + e.message, 'error');
                            document.getElementById('output').innerHTML = '<pre>' + text.substring(0, 500) + '</pre>';
                        }
                    }
                })
                .catch(err => {
                    showResult('❌ Error: ' + err.message, 'error');
                });
        }
        
        function testAddEvent() {
            document.getElementById('output').innerHTML = '<pre>Testing add_event.php...</pre>';
            
            const testData = {
                title: 'Test Event ' + new Date().getTime(),
                date: '2025-12-31',
                description: 'This is a test event created by the test script',
                location: 'Test Location'
            };
            
            fetch('api/add_event.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            })
            .then(res => res.text())
            .then(text => {
                if (text.trim().startsWith('<?php')) {
                    showResult('❌ PHP is NOT executing - raw PHP code returned', 'error');
                    document.getElementById('output').innerHTML = '<pre>' + text.substring(0, 500) + '</pre>';
                } else {
                    try {
                        const data = JSON.parse(text);
                        if (data.success) {
                            showResult('✓ Event added successfully! ID: ' + data.id, 'success');
                            document.getElementById('output').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                            // Refresh events list
                            setTimeout(testGetEvents, 1000);
                        } else {
                            showResult('❌ Error: ' + (data.error || 'Unknown error'), 'error');
                            document.getElementById('output').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        }
                    } catch (e) {
                        showResult('❌ Invalid JSON: ' + e.message, 'error');
                        document.getElementById('output').innerHTML = '<pre>' + text.substring(0, 500) + '</pre>';
                    }
                }
            })
            .catch(err => {
                showResult('❌ Fetch Error: ' + err.message, 'error');
            });
        }
    </script>
</body>
</html>


