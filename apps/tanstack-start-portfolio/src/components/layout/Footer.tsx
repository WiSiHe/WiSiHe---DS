import { Link } from '@tanstack/react-router';
import { footerLinks } from '@wisihe/constants';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className='relative w-full border-t border-border bg-surface mt-20'>
      <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12'>
        <div className='space-y-6'>
          <h3 className='text-2xl font-bold'>
            Henrik <span className='text-accent'>Sissener</span>
          </h3>
          <p className='max-w-xs text-foreground/60 leading-relaxed'>
            Frontend developer specializing in React and Svelte. Passionate about building
            beautiful, functional digital experiences.
          </p>
        </div>

        <div className='space-y-6'>
          <h4 className='text-xl font-bold text-accent'>Explore</h4>
          <ul className='space-y-3'>
            {footerLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={link.href as any}
                  className='text-foreground/70 hover:text-accent transition-colors'
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-6'>
          <h4 className='text-xl font-bold text-accent'>Connect</h4>
          <div className='flex gap-4'>
            <a
              href='https://github.com/wisihe'
              target='_blank'
              rel='noreferrer'
              className='group flex items-center gap-2 text-foreground/70 hover:text-accent font-medium transition-colors'
            >
              <FaGithub className='w-5 h-5 transition-transform group-hover:scale-110' />
              <span>GitHub</span>
            </a>
            <a
              href='https://linkedin.com/in/henrik-wilhelm-sissener'
              target='_blank'
              rel='noreferrer'
              className='group flex items-center gap-2 text-foreground/70 hover:text-accent font-medium transition-colors'
            >
              <FaLinkedin className='w-5 h-5 transition-transform group-hover:scale-110' />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8 border-t border-border/20 text-center'>
        <p className='text-sm text-foreground/40'>
          © {new Date().getFullYear()} Henrik Sissener • Built with TanStack Start
        </p>
      </div>
    </footer>
  );
}
