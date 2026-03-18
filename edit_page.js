const fs = require('fs');
let content = fs.readFileSync('k:/IPL/IPL_AUCTION/app/teams/page.tsx', 'utf8');

const old_card_start = content.indexOf('function TeamDetailCard');
const old_card_end = content.indexOf('export default function AllTeamsPage');
const old_card = content.substring(old_card_start, old_card_end);

const new_card = `function TeamDetailCard({ team, index }: {
    team: Team;
    index: number;
}) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const budgetPercent = (team.budgetRemaining / team.totalBudget) * 100;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 8, y: -x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <Link href={\`/team/\${team.id}\`}>
            <motion.div
                ref={cardRef}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: \`perspective(1000px) rotateX(\${tilt.x}deg) rotateY(\${tilt.y}deg)\`,
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
            >
                {/* Header */}
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="text-5xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            {team.logo}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-white text-xl truncate">
                                {team.name}
                            </h3>
                            <p className="text-white/50 text-sm">{team.shortName}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-green-400">₹{team.budgetRemaining}</div>
                                <div className="text-[10px] text-white/40">CR REMAINING</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-cyan-400">{team.squadCount}</div>
                                <div className="text-[10px] text-white/40">PLAYERS</div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Progress Bar */}
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: \`\${budgetPercent}%\` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>₹{team.budgetUsed} CR spent</span>
                        <span>{budgetPercent.toFixed(0)}% remaining</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

`;

content = content.replace(old_card, new_card);

content = content.replace(/    const \[allPlayers, setAllPlayers\] = useState<Player\[\]>\(\[\]\);\n/, "");
content = content.replace(/    const \[expandedTeam, setExpandedTeam\] = useState<number \| null>\(null\);\n/, "");

content = content.replace(/import { Player } from '@\/lib\/mockData\/players';\n/, "");
content = content.replace(/import { getAllPlayers } from '@\/lib\/api\/players';\n/, "");

const old_render = `                    {sortedTeams.map((team, index) => (
                        <TeamDetailCard
                            key={team.id}
                            team={team}
                            allPlayers={allPlayers}
                            index={index}
                            isExpanded={expandedTeam === team.id}
                            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                        />
                    ))}`;

const new_render = `                    {sortedTeams.map((team, index) => (
                        <TeamDetailCard
                            key={team.id}
                            team={team}
                            index={index}
                        />
                    ))}`;

content = content.replace(old_render, new_render);

content = content.replace('<span className="text-white/40 text-sm ml-2">Click any team to expand</span>', '');

let old_use_effect = `    useEffect(() => {
        const loadData = async () => {
            try {
                const [teamsData, playersData] = await Promise.all([
                    getAllTeams(),
                    getAllPlayers(),
                ]);
                setTeams(teamsData);
                setAllPlayers(playersData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading teams:', error);
                setLoading(false);
            }
        };

        loadData();

        // Poll for updates
        const interval = setInterval(async () => {
            const [teamsData, playersData] = await Promise.all([
                getAllTeams(),
                getAllPlayers(),
            ]);
            setTeams(teamsData);
            setAllPlayers(playersData);
        }, 3000);

        return () => clearInterval(interval);
    }, []);`;

let new_use_effect = `    useEffect(() => {
        const loadData = async () => {
            try {
                const teamsData = await getAllTeams();
                setTeams(teamsData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading teams:', error);
                setLoading(false);
            }
        };

        loadData();

        // Poll for updates
        const interval = setInterval(async () => {
            const teamsData = await getAllTeams();
            setTeams(teamsData);
        }, 3000);

        return () => clearInterval(interval);
    }, []);`;

content = content.replace(old_use_effect, new_use_effect);

fs.writeFileSync('k:/IPL/IPL_AUCTION/app/teams/page.tsx', content);
console.log("Modification Complete");
