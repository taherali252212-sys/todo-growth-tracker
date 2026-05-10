import './globals.css'

export const metadata = {
  title: 'Daily Growth Tracker',
  description: 'Track your daily todos and visualize your growth over time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
    }
