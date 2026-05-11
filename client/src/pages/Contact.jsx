export default function Contact() {
  return (
    <div className="glass mx-auto max-w-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
        <input className="input" placeholder="Your name" />
        <input className="input" placeholder="Email" type="email" />
        <textarea className="input" rows={4} placeholder="Message" />
        <button className="btn-primary w-full">Send</button>
      </form>
    </div>
  );
}
