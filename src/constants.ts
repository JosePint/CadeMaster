import { Code, Layout, Blocks, Database, Terminal, Smartphone } from 'lucide-react';
import { Track } from './types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'js-basics',
    title: 'JavaScript Moderno',
    description: 'Aprenda os fundamentos da linguagem que move a web, do ES6 ao Async/Await.',
    icon: 'Code',
    color: 'bg-yellow-400',
    difficulty: 'beginner'
  },
  {
    id: 'python-intro',
    title: 'Introdução ao Python',
    description: 'Domine a sintaxe clara do Python e comece sua jornada em ciência de dados e automação.',
    icon: 'Terminal',
    color: 'bg-blue-500',
    difficulty: 'beginner'
  },
  {
    id: 'html-css',
    title: 'HTML5 & CSS3',
    description: 'Construa layouts modernos e responsivos com as tecnologias fundamentais do design web.',
    icon: 'Layout',
    color: 'bg-orange-500',
    difficulty: 'beginner'
  },
  {
    id: 'react-adv',
    title: 'React Avançado',
    description: 'Componentização, Hooks personalizados e gerenciamento de estado complexo.',
    icon: 'Blocks',
    color: 'bg-cyan-400',
    difficulty: 'advanced'
  }
];
