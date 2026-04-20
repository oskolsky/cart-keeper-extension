const HOW_IT_WORKS_URL = '/how-it-works.html'
const LINKEDIN_URL = 'https://www.linkedin.com/in/oskolsky/'
const PRIVACY_POLICY_URL = '/privacy-policy.html'

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white px-5 py-3 text-xs text-gray-400">
            <div className="flex items-center justify-between gap-3">
                <a
                    href={PRIVACY_POLICY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium hover:text-gray-600"
                >
                    Privacy
                </a>
                <a href={HOW_IT_WORKS_URL} target="_blank" rel="noreferrer" className="font-medium hover:text-gray-600">
                    How it works
                </a>
                <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact author on LinkedIn"
                    className="flex items-center gap-1.5 font-medium hover:text-gray-600"
                >
                    Contact
                </a>
            </div>
        </footer>
    )
}
