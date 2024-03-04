import { useState } from 'react';
import { Button, Form, Container, Col, Card, Badge } from 'react-bootstrap';
import './index.css';

function App() {

	/**Initial state */
	const [value, setValue] = useState("")
	const [error, setError] = useState("")
	const [chatHistory, setChatHistory] = useState([])

	/**Default options */
	const surpriseOptions = [
		'Who was the first Indian prime minister?',
		'Who was the first person to land on the moon?',
		'where does pizza come from?'
	]

	const surprise = () => {
		const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
		setValue(randomValue)
	}

	const getResponse = async () => {
		if (!value) {
			setError("Error! Please ask a question!")
			return
		}
		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					history: chatHistory,
					message: value
				})
			}

			const response = await fetch('https://gemini-genie.vercel.app/gemini', options)
			const result = await response.text()
			setChatHistory(oldChatHistory => [
				...oldChatHistory,
				{
					role: "user",
					parts: value,
				},
				{
					role: "model",
					parts: result,
				}
			])
			setValue('')
		} catch (error) {
			console.log(error)
			setError('Something went wrong! Please try again later.')
		}
	}

	const clear = () => {
		setValue('');
		setError('');
		setChatHistory([]);
	}

	return (
		<div className="App">
			<Container>
				<p>What do you want to know?</p>
				<Button variant='dark' onClick={surprise} disabled={!chatHistory}>Surprise me</Button>
				<Form.Group as={Col} md="4" controlId="validationCustom01">
					<Form.Control
						type="text"
						placeholder="When is christmas...?"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						isInvalid={error}
					/>
					{error && <Form.Control.Feedback type={`${error ? "invalid" : ""}`}>{error}</Form.Control.Feedback>}
				</Form.Group>
				{!error && <Button variant='dark' onClick={getResponse}>Ask Me</Button>}
				{error && <Button variant='danger' onClick={clear}>Clear</Button>}
				<div style={{ maxHeight: "800px", overflowY: "scroll" }}>
					{chatHistory.map((chatItem, _index) => (
						<Card key={_index}>
							<Card.Body>
								<Badge bg="info">{chatItem.role}</Badge>
								<p>{chatItem.parts}</p>
							</Card.Body>
						</Card>

					))}
				</div>
			</Container>
		</div >
	);
}

export default App;
