
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'transparent',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      }}>
      <div
        className="text-center text-white text-sm"
        style={{
          backgroundColor: '#945f14',
          clipPath: 'polygon(0 20%,100% 0,100% 100%,0% 100%)',
          padding: '1rem 0'
        }}
      >
        <p className="text-sm">
          Idee door{' '}
          <a
            href="https://www.andriestunru.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline"
          >
            Andries Tunru
          </a>
          .
        </p>
        Realisatie door ProgParty
      </div>
    </footer>
  )
}
