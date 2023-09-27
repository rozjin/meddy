export default ({ children } : { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-screen max-w-4xl p-4 mx-auto">
        {children}
      </main>
    </>
  )
}